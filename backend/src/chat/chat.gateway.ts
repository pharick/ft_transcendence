import {
  OnGatewayConnection,
  OnGatewayDisconnect,
  WebSocketGateway,
  WebSocketServer,
} from '@nestjs/websockets';
import { Namespace, Socket } from 'socket.io';
import { Logger } from '@nestjs/common';
import { User } from '../users/user.entity';
import { ChatRoom } from './chatRoom.entity';
import { ChatRoomsService } from './chatRooms.service';
import { AuthService } from '../auth/auth.service';

@WebSocketGateway({ namespace: 'chat', cors: true })
export class ChatGateway implements OnGatewayConnection, OnGatewayDisconnect {
  @WebSocketServer()
  server: Namespace;
  private logger = new Logger('ChatGateway');

  constructor(
    private chatRoomService: ChatRoomsService,
    private authService: AuthService,
  ) {}

  async handleConnection(client: Socket) {
    const { token, roomId } = client.handshake.auth;
    const room: ChatRoom = await this.chatRoomService.findOne(roomId);
    const user: User = await this.authService.getUser(token);

    if (!room) {
      client.disconnect();
    } else {
      client.join(`room-${room.id}`);
      this.logger.log(
        `Chat client ${client.id} (user ${user?.id}) connected to ${room.name} room`,
      );
    }
  }

  handleDisconnect(client: Socket) {
    this.logger.log(`Chat client disconnected: ${client.id}`);
  }
}
