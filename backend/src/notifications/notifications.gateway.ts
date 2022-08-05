import {
  OnGatewayConnection,
  OnGatewayDisconnect,
  WebSocketGateway,
  WebSocketServer,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { AuthService } from '../auth/auth.service';
import { User } from '../users/user.entity';
import { GamesService } from '../games/games.service';
import { Notifications } from './notifications.interface';
import { PendingGamesService } from '../pendingGames/pendingGames.service';
import { forwardRef, Inject, Logger } from '@nestjs/common';
import { NotificationsService } from './notifications.service';

@WebSocketGateway({ namespace: 'notifications', cors: true })
export class NotificationsGateway
  implements OnGatewayConnection, OnGatewayDisconnect
{
  private logger: Logger = new Logger('NotificationsGateway');

  @WebSocketServer()
  server: Server;

  constructor(
    private authService: AuthService,
    @Inject(forwardRef(() => NotificationsService))
    private notificationsService: NotificationsService,
  ) {}

  async handleConnection(client: Socket) {
    const { token } = client.handshake.auth;
    const user: User = await this.authService.getUser(token);
    this.logger.log(
      `Notifications client connected: ${client.id} (user ${user?.id})`,
    );
    if (!user) return;

    client.join(`user-${user?.id}`);
    await this.notificationsService.send(user?.id);
  }

  handleDisconnect(client: Socket) {
    this.logger.log(`Notifications client disconnected: ${client.id}`);
  }
}
