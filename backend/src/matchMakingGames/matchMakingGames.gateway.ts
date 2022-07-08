import {
  OnGatewayConnection,
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { Logger } from '@nestjs/common';

@WebSocketGateway({ namespace: 'matchMaking', cors: true })
export class MatchMakingGamesGateway implements OnGatewayConnection {
  @WebSocketServer()
  server: Server;
  private logger: Logger = new Logger('MatchMakingGamesGateway');

  @SubscribeMessage('cancel')
  handleMessage(client: Socket, ...args): void {
    //this.server.emit('updateMatchMaking', args[0], args[1], args[2]);
  }

  handleConnection(client: Socket, ...args: any[]): void {
    this.logger.log(`MatchMaking client connected: ${client.id}`);
  }
}
