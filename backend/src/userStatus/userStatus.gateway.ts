import {
  OnGatewayConnection,
  OnGatewayDisconnect,
  WebSocketGateway,
  WebSocketServer,
} from '@nestjs/websockets';
import { Namespace, Socket } from 'socket.io';
import { Logger } from '@nestjs/common';
import { AuthService } from '../auth/auth.service';
import { User } from '../users/user.entity';

@WebSocketGateway({ namespace: 'status', cors: true })
export class UserStatusGateway
  implements OnGatewayConnection, OnGatewayDisconnect
{
  @WebSocketServer()
  server: Namespace;

  private logger: Logger = new Logger('UserStatusGateway');

  constructor(private authService: AuthService) {}

  async handleConnection(client: Socket) {
    const { token } = client.handshake.auth;
    const user: User = await this.authService.getUser(token);
    if (user) client.join(`user-${user.id}`);
    this.logger.log(
      `UserStatus client connected: ${client.id} (user ${user?.id})`,
    );
  }

  handleDisconnect(client: Socket) {
    this.logger.log(`UserStatus client disconnected: ${client.id}`);
  }
}
