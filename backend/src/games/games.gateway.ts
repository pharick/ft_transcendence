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
import { Game, GameFrame } from './games.interfaces';
import { User } from '../users/user.entity';
import { AuthService } from '../auth/auth.service';
import { ResumeGameDto } from './games.dtos';
import { use } from 'passport';

@WebSocketGateway({
  namespace: 'game',
  cors: true,
})
export class GamesGateway implements OnGatewayConnection, OnGatewayDisconnect {
  @WebSocketServer()
  private server: Server;

  private logger: Logger = new Logger('GamesGateway');
  private readonly frame_delta: number = 40;
  private timers = new Map<string, NodeJS.Timer>();

  constructor(
    private gamesService: GamesService,
    private authService: AuthService,
  ) {}

  async handleConnection(client: Socket, ...args: any[]): Promise<void> {
    const { token, gameId } = client.handshake.auth;
    const game: Game = await this.gamesService.findOne(gameId);
    const user: User = await this.authService.getUser(token);

    if (!game) {
      client.disconnect();
    } else {
      let userType;
      if (game.player1.id == user.id) userType = 'player1';
      else if (game.player2.id == user.id) userType = 'player2';
      else userType = 'watcher';

      client.join(gameId);
      client.join(`${gameId}-${userType}`);

      this.logger.log(
        `Client ${client.id} (user ${user?.id}) connected to ${gameId} game as ${userType}`,
      );

      if (!this.timers.has(gameId)) this.sendFramesStart(gameId);
    }
  }

  handleDisconnect(client: Socket, ...args: any[]): any {
    this.logger.log(`Game client ${client.id} disconnected`);
  }

  private sendFramesStart(gameId: string) {
    this.timers.set(
      gameId,
      setInterval(() => {
        this.sendNextFrame(gameId);
      }, this.frame_delta),
    );
  }

  private sendNextFrame(gameId: string) {
    if (!this.timers.has(gameId)) return;
    const frame: GameFrame = this.gamesService.getNextFrame(gameId);
    this.server.to(gameId).emit('nextFrame', frame);

    // if (
    //   frame.scores.player1 >= this.max_score ||
    //   frame.scores.player2 >= this.max_score
    // ) {
    //   clearInterval(this.timers[gameId]);
    //   delete this.timers[gameId];
    //   const completedGame = await this.gamesService.endGame(gameId);
    //   this.server.to(gameId).emit('endGame', completedGame);
    // } else {

    // }
  }

  @SubscribeMessage('resume')
  async handleResume(client: Socket, { gameId }: ResumeGameDto) {
    const game: Game = await this.gamesService.findOne(gameId);
    console.log(game);
    console.log(client.rooms);
    if (!game) return;
    if (
      (game.isPlayer1Turn && client.rooms.has(`${gameId}-player1`)) ||
      (!game.isPlayer1Turn && client.rooms.has(`${gameId}-player2`))
    ) {
      this.logger.log(`Client ${client.id} resumed game ${game.id}`);
      this.gamesService.resumeGame(gameId);
    }
  }

  // @SubscribeMessage('moveClubStart')
  // handleMoveClubStart(client: Socket, { gameId, userSessionId, up }): void {
  //   this.logger.log('Club start moving');
  //   const userId = 0;
  //   this.gamesService.moveClubStart(gameId, userId, up);
  // }

  // @SubscribeMessage('moveClubStop')
  // handleMoveClubStop(client: Socket, { gameId, userSessionId }): void {
  //   this.logger.log('Club stop moving');
  //   const userId = 0;
  //   this.gamesService.moveClubStop(gameId, userId);
  // }
}
