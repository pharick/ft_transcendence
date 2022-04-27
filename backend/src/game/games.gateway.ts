import {OnGatewayConnection, SubscribeMessage, WebSocketGateway, WebSocketServer} from '@nestjs/websockets';
import { Server, Socket } from "socket.io";
import { Logger } from "@nestjs/common";

import { GamesService } from "./games.service";
import { FrameInfo, GameInfo } from './games.interfaces';

@WebSocketGateway({ cors: true })
export class GamesGateway implements OnGatewayConnection {
  @WebSocketServer()
  server: Server;
  private logger: Logger = new Logger('GamesGateway');

  constructor(private gamesService: GamesService) {}

  handleConnection(client: Socket, ...args: any[]): void {
    this.logger.log(`Pong client connected: ${client.id}`);
  }

  private sendNextFrame(gameId: string): void {
    const frame: FrameInfo = this.gamesService.getNextFrame(gameId);
    this.server.to(gameId).emit('nextFrame', frame);
  }

  @SubscribeMessage('connectToGame')
  async handleConnectToGame(client: Socket, gameId: string): Promise<void> {
    const gameInfo: GameInfo = await this.gamesService.findOne(gameId);
    if (!gameInfo) {
      client.emit('gameNotFoundError');
    } else {
      this.logger.log(`Client connected to game: ${gameId}`);
      client.join(gameId);
      setInterval(() => {
        this.sendNextFrame(gameId)
      }, 10);
    }
  }

  @SubscribeMessage('moveClub1')
  handleMoveClub(client: Socket, data: any): void {
    this.logger.log(data);
    // this.gamesService.moveClub()
  }
}
