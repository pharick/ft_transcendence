import {
  OnGatewayConnection,
  OnGatewayDisconnect,
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
} from '@nestjs/websockets';
import { Namespace, Socket } from 'socket.io';
import { forwardRef, Inject, Logger } from '@nestjs/common';
import { User } from '../users/user.entity';
import { ChatRoom, ChatRoomType } from './chatRoom.entity';
import { ChatRoomsService } from './chatRooms.service';
import { AuthService } from '../auth/auth.service';
import { ChatRoomUser } from './chatRoomUser.entity';
import { ChatMessagesService } from './chatMessages.service';
import { ChatMessageDto, ChatRoomPasswordDto } from './chat.dtos';
import { RoomUsersService } from './roomUsers.service';

@WebSocketGateway({ namespace: 'chat', cors: true })
export class ChatGateway implements OnGatewayConnection, OnGatewayDisconnect {
  @WebSocketServer()
  server: Namespace;
  private logger = new Logger('ChatGateway');

  constructor(
    @Inject(forwardRef(() => ChatRoomsService))
    private chatRoomService: ChatRoomsService,
    private roomUsersService: RoomUsersService,
    private chatMessagesService: ChatMessagesService,
    private authService: AuthService,
  ) {}

  async handleConnection(client: Socket) {
    const { token, roomId } = client.handshake.auth;
    await this.authenticate(client, token, roomId);
  }

  async handleDisconnect(client: Socket) {
    const { roomId } = client.handshake.auth;
    this.server
      .to(`room-${roomId}`)
      .emit('sendClients', await this.chatRoomService.getRoomUsers(roomId));
    this.logger.log(`Chat client disconnected: ${client.id}`);
  }

  @SubscribeMessage('enterPassword')
  async handleEnterPassword(client: Socket, { password }: ChatRoomPasswordDto) {
    const { token, roomId } = client.handshake.auth;
    await this.authenticate(client, token, roomId, password);
  }

  @SubscribeMessage('messageToServer')
  async handleMessageToServer(
    client: Socket,
    { roomId, text }: ChatMessageDto,
  ) {
    const { token } = client.handshake.auth;
    const user = await this.authService.getUser(token);
    if (!user) return;
    const roomUser = await this.roomUsersService.findOneByUserId(
      roomId,
      user.id,
    );
    const muteDate = await this.checkMute(roomUser);
    if (muteDate) {
      client.emit('muted', `You're muted until ${muteDate}`);
    } else {
      const message = await this.chatMessagesService.create(
        user.id,
        roomId,
        text,
      );
      this.server.to(`room-${roomId}`).emit('messageToClient', message);
    }
  }

  private async authenticate(
    client: Socket,
    token: string,
    roomId: number,
    password: string = null,
  ) {
    const room: ChatRoom = await this.chatRoomService.findOne(roomId);
    const user: User = await this.authService.getUser(token);
    if (!room || !user) {
      client.emit(
        'forbidden',
        'You should be authenticated to enter chat room',
      );
      client.disconnect();
      return;
    }

    const roomUser: ChatRoomUser = await this.chatRoomService.authenticate(
      room.id,
      user.id,
      password,
    );

    if (!roomUser && room.type == ChatRoomType.Private) {
      client.emit('forbidden', `This room is private`);
      client.disconnect();
      return;
    }
    const banDate = await this.checkBan(roomUser);
    if (banDate) {
      client.emit('forbidden', `You're banned until ${banDate}`);
      client.disconnect();
      return;
    }
    if (!roomUser && room.type == ChatRoomType.Protected) {
      client.emit('passwordRequired');
      return;
    }

    client.join(`room-${room.id}`);
    client.join(`user-${user.id}`);

    this.server
      .to(`room-${roomId}`)
      .emit('sendClients', await this.chatRoomService.getRoomUsers(roomId));
    this.server
      .to(`user-${user.id}`)
      .emit(
        'initMessages',
        await this.chatMessagesService.findAllByRoom(room.id),
      );

    this.logger.log(
      `Chat client ${client.id} (user ${user?.id}) connected to ${room.name} room`,
    );
  }

  private async checkBan(roomUser: ChatRoomUser): Promise<Date | null> {
    if (!roomUser?.bannedUntil) return null;
    const now = new Date();
    if (roomUser.bannedUntil <= now) {
      await this.roomUsersService.resetBan(roomUser.id);
      return null;
    }
    return roomUser.bannedUntil;
  }

  private async checkMute(roomUser: ChatRoomUser): Promise<Date | null> {
    if (!roomUser.mutedUntil) return null;
    const now = new Date();
    if (roomUser.mutedUntil <= now) {
      await this.roomUsersService.resetMute(roomUser.id);
      return null;
    }
    return roomUser.mutedUntil;
  }
}
