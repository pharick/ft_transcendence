import {
  OnGatewayConnection,
  OnGatewayDisconnect,
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { Logger } from '@nestjs/common';
import { UserStatusService } from './userStatus.service';

@WebSocketGateway({ namespace: 'notifications', cors: true })
export class NotificationsGateway
  implements OnGatewayConnection, OnGatewayDisconnect
{
  @WebSocketServer()
  server: Server;
  private logger: Logger = new Logger('NotificationsGateway');

  constructor(private userStatusService: UserStatusService) {}

  handleConnection(client: Socket, ...args: any[]): void {
    this.logger.log(`Notifications client connected: ${client.id}`);
  }

  handleDisconnect(client: Socket): void {
    this.logger.log(`Notifications client connected: ${client.id}`);
    this.userStatusService.remove(client.id);
  }

  @SubscribeMessage('introduce')
  handleIntroduce(client: Socket, userId: number): void {
    this.logger.log(`Notifications user connected: ${userId}`);
    this.userStatusService.add(client.id, userId);
  }
}
