import {
  OnGatewayConnection,
  OnGatewayDisconnect,
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
} from '@nestjs/websockets';
import { Logger } from '@nestjs/common';
import { Server, Socket } from 'socket.io';

@WebSocketGateway({ namespace: 'chat', cors: true })
export class ChatGateway implements OnGatewayConnection, OnGatewayDisconnect {
  @WebSocketServer()
  server: Server;

  private logger: Logger = new Logger('ChatGateway');

  @SubscribeMessage('msgToServer')
  handleMessage(client: Socket, message: string): void {
    this.logger.log(`New message: ${message}`);
    this.server.emit('msgToClient', message);
  }

  handleConnection(client: Socket, ...args: any[]): void {
    this.logger.log(`Chat client connected: ${client.id}`);
  }

  handleDisconnect(client: Socket): void {
    this.logger.log(`Chat client disconnected: ${client.id}`);
  }
}
