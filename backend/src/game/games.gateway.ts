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

  @SubscribeMessage('connectToGame')
  handleConnectToGame(client: Socket, gameId: string): void {
    const gameInfo: GameInfo = this.gamesService.findOne(gameId);
    if (!gameInfo) {
      client.emit('gameNotFoundError');
    } else {
      this.logger.log(`Client connected to game: ${gameId}`);
      client.join(gameId);
    }
  }

  @SubscribeMessage('getNextFrame')
  handleGetNextFrame(client: Socket, gameId: string): void {
    const frame: FrameInfo = this.gamesService.getNextFrame(gameId);
    this.server.to(gameId).emit('nextFrame', frame);
  }

  // @SubscribeMessage('moveClub1')
  // handleMoveClub1(client: Socket, delta: number): void {
  //   this.pongService.moveClub1(delta);
  // }
  //
  // @SubscribeMessage('moveClub2')
  // handleMoveClub2(client: Socket, delta: number): void {
  //   this.pongService.moveClub2(delta);
  // }
}
