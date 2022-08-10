import {
  OnGatewayConnection,
  WebSocketGateway,
  WebSocketServer,
} from '@nestjs/websockets';
import { Namespace, Socket } from 'socket.io';
import { Logger } from '@nestjs/common';
import { User } from '../users/user.entity';
import { AuthService } from '../auth/auth.service';

@WebSocketGateway({ namespace: 'matchmaking', cors: true })
export class MatchMakingGateway implements OnGatewayConnection {
  @WebSocketServer()
  server: Namespace;

  private logger: Logger = new Logger('MatchMakingGateway');

  constructor(private authService: AuthService) {}

  async handleConnection(client: Socket) {
    const { token } = client.handshake.auth;
    const user: User = await this.authService.getUser(token);
    client.join(`user-${user?.id}`);
    this.logger.log(
      `MatchMaking client connected: ${client.id} (user ${user?.id})`,
    );
  }
}
