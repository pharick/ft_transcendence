import {
  OnGatewayConnection,
  WebSocketGateway,
  WebSocketServer,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { Logger } from '@nestjs/common';

@WebSocketGateway({ namespace: 'matchmaking', cors: true })
export class MatchMakingGamesGateway implements OnGatewayConnection {
  @WebSocketServer()
  server: Server;
  private logger: Logger = new Logger('MatchMakingGamesGateway');

  handleConnection(client: Socket, ...args: any[]): void {
    this.logger.log(`MatchMaking client connected: ${client.id}`);
  }
}
