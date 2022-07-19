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

@WebSocketGateway({ namespace: 'chat', cors: true })
export class ChatGateway implements OnGatewayConnection, OnGatewayDisconnect {
  @WebSocketServer()
  server: Server;

  private logger: Logger = new Logger('ChatGateway');

  constructor(private chatService: ChatMessagesService) {}

  @SubscribeMessage('msgToServer')
  async handleMessage(client: Socket, message: ChatMessageDto): Promise<void> {
    const newMessage = await this.chatService.create(message);
    if (!newMessage) return;
    this.server.emit('msgToClient', newMessage);
  }

  handleConnection(client: Socket, ...args: any[]): void {
    this.logger.log(`Chat client connected: ${client.id}`);
  }

  handleDisconnect(client: Socket): void {
    this.logger.log(`Chat client disconnected: ${client.id}`);
  }
}
