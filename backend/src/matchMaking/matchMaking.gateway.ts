import {
  OnGatewayConnection,
  WebSocketGateway,
  WebSocketServer,
} from '@nestjs/websockets';
import { Namespace, Socket } from 'socket.io';
import { Logger } from '@nestjs/common';

@WebSocketGateway({ namespace: 'matchmaking', cors: true })
export class MatchMakingGateway implements OnGatewayConnection {
  @WebSocketServer()
  server: Namespace;

  private logger: Logger = new Logger('MatchMakingGateway');

  handleConnection(client: Socket): void {
    this.logger.log(`MatchMaking client connected: ${client.id}`);
  }
}
