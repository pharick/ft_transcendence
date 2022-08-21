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
import { ChatRoom } from './chatRoom.entity';
import { ChatRoomsService } from './chatRooms.service';
import { AuthService } from '../auth/auth.service';
import { ChatRoomUser } from './chatRoomUser.entity';
import { ChatMessagesService } from './chatMessages.service';
import { ChatMessageDto } from './chat.dtos';

@WebSocketGateway({ namespace: 'chat', cors: true })
export class ChatGateway implements OnGatewayConnection, OnGatewayDisconnect {
  @WebSocketServer()
  server: Namespace;
  private logger = new Logger('ChatGateway');

  constructor(
    @Inject(forwardRef(() => ChatRoomsService))
    private chatRoomService: ChatRoomsService,
    private chatMessagesService: ChatMessagesService,
    private authService: AuthService,
  ) {}

  async handleConnection(client: Socket) {
    const { token, roomId } = client.handshake.auth;
    const room: ChatRoom = await this.chatRoomService.findOne(roomId);
    const user: User = await this.authService.getUser(token);

    if (!room || !user) {
      client.disconnect();
      return;
    }

    const roomUser: ChatRoomUser = await this.chatRoomService.authenticate(
      room.id,
      user.id,
    );

    if (!roomUser) {
      client.disconnect();
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

  async handleDisconnect(client: Socket) {
    const { roomId } = client.handshake.auth;
    this.server
      .to(`room-${roomId}`)
      .emit('sendClients', this.chatRoomService.getRoomUsers(roomId));
    this.logger.log(`Chat client disconnected: ${client.id}`);
  }

  @SubscribeMessage('messageToServer')
  async handleMessageToServer(
    client: Socket,
    { roomId, text }: ChatMessageDto,
  ) {
    const { token } = client.handshake.auth;
    const user = await this.authService.getUser(token);
    if (!user) return;
    const message = await this.chatMessagesService.create(
      user.id,
      roomId,
      text,
    );
    console.log(message);
    this.server.to(`room-${roomId}`).emit('messageToClient', message);
  }
}
