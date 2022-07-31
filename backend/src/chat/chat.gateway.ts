import {
  OnGatewayConnection,
  OnGatewayDisconnect,
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
} from '@nestjs/websockets';
import { Logger } from '@nestjs/common';
import { Server, Socket } from 'socket.io';
import { ChatMessageDto } from './chatMessage.dto';
import { ChatMessagesService } from './chatMessages.service';
import { ChatRoomDto } from './charRoom.dto';

@WebSocketGateway({ namespace: 'chat', cors: true })
export class ChatGateway implements OnGatewayConnection, OnGatewayDisconnect {
  @WebSocketServer()
  server: Server;

  private logger: Logger = new Logger('ChatGateway');

  constructor(private chatService: ChatMessagesService) {}

  @SubscribeMessage('connectToRoom')
  handleConnectToRoom(client: Socket, room: ChatRoomDto | null): void {
    const roomName = room ? `room${room.id}` : 'common room';
    this.logger.log(`${client.id} connected to ${roomName}`);
    client.join(roomName);
  }

  @SubscribeMessage('msgToServer')
  async handleMessage(client: Socket, message: ChatMessageDto): Promise<void> {
    // const newMessage = await this.chatService.create(message);
    // if (!newMessage) return;

    client.rooms.forEach((room) => {
      if (room == client.id) return;
      // this.server.to(room).emit('msgToClient', newMessage);
    });
  }

  handleConnection(client: Socket, ...args: any[]): void {
    this.logger.log(`Chat client connected: ${client.id}`);
  }

  handleDisconnect(client: Socket): void {
    this.logger.log(`Chat client disconnected: ${client.id}`);
  }
}
