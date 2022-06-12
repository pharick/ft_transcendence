import {
  OnGatewayConnection,
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { Logger } from '@nestjs/common';

import { GamesService } from './games.service';
import { FrameInfo, GameInfo } from './games.interfaces';
import { AuthService } from '../auth/auth.service';

@WebSocketGateway({ namespace: 'game', cors: true })
export class GamesGateway implements OnGatewayConnection {
  @WebSocketServer()
  server: Server;
  private logger: Logger = new Logger('GamesGateway');

  private readonly max_score: number = 11;

  private timers: Record<string, NodeJS.Timer> = {};

  constructor(
    private gamesService: GamesService,
    private authService: AuthService,
  ) {}

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  handleConnection(client: Socket, ...args: any[]): void {
    this.logger.log(`Pong client connected: ${client.id}`);
  }

  private async sendNextFrame(gameId: string): Promise<void> {
    const frame: FrameInfo = this.gamesService.getNextFrame(gameId);
    if (
      frame.scores.player1 >= this.max_score ||
      frame.scores.player2 >= this.max_score
    ) {
      clearInterval(this.timers[gameId]);
      delete this.timers[gameId];
      const completedGame = await this.gamesService.endGame(gameId);
      this.server.to(gameId).emit('endGame', completedGame);
    } else {
      this.server.to(gameId).emit('nextFrame', frame);
    }
  }

  @SubscribeMessage('connectToGame')
  async handleConnectToGame(client: Socket, gameId: string): Promise<void> {
    const gameInfo: GameInfo = await this.gamesService.findOne(gameId);
    if (!gameInfo) {
      client.emit('gameNotFoundError');
    } else {
      this.logger.log(`Client connected to game: ${gameId}`);
      client.join(gameId);
      this.timers[gameId] = setInterval(() => {
        this.sendNextFrame(gameId);
      }, 16);
    }
  }

  @SubscribeMessage('moveClubStart')
  handleMoveClubStart(client: Socket, { gameId, userSessionId, up }): void {
    this.logger.log('Club start moving');
    const userId = this.authService.getUserIdBySessionId(userSessionId);
    this.gamesService.moveClubStart(gameId, userId, up);
  }

  @SubscribeMessage('moveClubStop')
  handleMoveClubStop(client: Socket, { gameId, userSessionId }): void {
    this.logger.log('Club stop moving');
    const userId = this.authService.getUserIdBySessionId(userSessionId);
    this.gamesService.moveClubStop(gameId, userId);
  }
}
