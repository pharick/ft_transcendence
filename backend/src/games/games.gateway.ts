import {
  OnGatewayConnection,
  OnGatewayDisconnect,
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { Logger } from '@nestjs/common';

import { GamesService } from './games.service';
import { FrameInfo, GameInfo } from './games.interfaces';

@WebSocketGateway({
  namespace: 'game',
  cors: true,
})
export class GamesGateway implements OnGatewayConnection, OnGatewayDisconnect {
  @WebSocketServer()
  server: Server;
  private logger: Logger = new Logger('GamesGateway');

  private readonly max_score: number = 11;
  private readonly frame_delta: number = 40;

  private timers: Record<string, NodeJS.Timer> = {};

  constructor(private gamesService: GamesService) {}

  async handleConnection(client: Socket, ...args: any[]): Promise<void> {
    const gameId = client.handshake.auth.gameId;
    const gameInfo: GameInfo = await this.gamesService.findOne(gameId);
    //
    // if (!gameInfo) {
    //   client.emit('gameNotFoundError');
    // } else {
    //   this.logger.log(`Game client ${client.id} connected to ${gameId} game`);
    //   client.join(gameId);
    //   this.timers[gameId] = setInterval(() => {
    //     this.sendNextFrame(gameId);
    //   }, this.frame_delta);
    // }
  }

  handleDisconnect(client: Socket, ...args: any[]): any {
    this.logger.log(`Pong client disconnect ${client.id}`);
  }

  // private async sendNextFrame(gameId: string): Promise<void> {
  //   if (!(gameId in this.timers) || !this.timers[gameId]) return;
  //   const frame: FrameInfo = this.gamesService.getNextFrame(gameId);
  //   if (!frame) return;
  //   if (
  //     frame.scores.player1 >= this.max_score ||
  //     frame.scores.player2 >= this.max_score
  //   ) {
  //     clearInterval(this.timers[gameId]);
  //     delete this.timers[gameId];
  //     const completedGame = await this.gamesService.endGame(gameId);
  //     this.server.to(gameId).emit('endGame', completedGame);
  //   } else {
  //     this.server.to(gameId).emit('nextFrame', frame);
  //   }
  // }
  //
  // @SubscribeMessage('moveClubStart')
  // handleMoveClubStart(client: Socket, { gameId, userSessionId, up }): void {
  //   this.logger.log('Club start moving');
  //   const userId = 0;
  //   this.gamesService.moveClubStart(gameId, userId, up);
  // }
  //
  // @SubscribeMessage('moveClubStop')
  // handleMoveClubStop(client: Socket, { gameId, userSessionId }): void {
  //   this.logger.log('Club stop moving');
  //   const userId = 0;
  //   this.gamesService.moveClubStop(gameId, userId);
  // }
}
