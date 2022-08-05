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
import { MoveClubStartDto, MoveClubStopDto, ResumeGameDto } from './games.dtos';

enum GameUserType {
  Player1 = 'player1',
  Player2 = 'player2',
  Watcher = 'watcher',
}

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

  async handleConnection(client: Socket) {
    const { token, gameId } = client.handshake.auth;
    const game: Game = await this.gamesService.findOne(gameId);
    const user: User = await this.authService.getUser(token);

    if (!game) {
      client.disconnect();
    } else {
      const userType = this.getUserType(user?.id, game);

      client.join(gameId);
      client.join(`${gameId}-${userType}`);

      this.logger.log(
        `Client ${client.id} (user ${user?.id}) connected to ${gameId} game as ${userType}`,
      );

      if (!this.timers.has(gameId)) this.sendFramesStart(gameId);
    }
  }

  handleDisconnect(client: Socket) {
    this.logger.log(`Game client ${client.id} disconnected`);
  }

  private getUserType(playerId: number, game: Game): GameUserType {
    if (playerId == game.player1.id) return GameUserType.Player1;
    if (playerId == game.player2.id) return GameUserType.Player2;
    return GameUserType.Watcher;
  }

  private sendFramesStart(gameId: string) {
    this.timers.set(
      gameId,
      setInterval(() => {
        this.sendNextFrame(gameId).then();
      }, this.frame_delta),
    );
  }

  private async sendNextFrame(gameId: string) {
    if (!this.timers.has(gameId)) return;
    const frame: GameFrame = this.gamesService.getNextFrame(gameId);

    if (!frame.isCompleted) {
      this.server.to(gameId).emit('nextFrame', frame);
    } else {
      clearInterval(this.timers[gameId]);
      this.timers.delete(gameId);
      const completedGame = await this.gamesService.endGame(gameId);
      this.server.to(gameId).emit('endGame', completedGame);
    }
  }

  @SubscribeMessage('resume')
  async handleResume(client: Socket, { gameId }: ResumeGameDto) {
    const game: Game = await this.gamesService.findOne(gameId);
    if (!game) return;
    if (
      (game.isPlayer1Turn &&
        client.rooms.has(`${gameId}-${GameUserType.Player1}`)) ||
      (!game.isPlayer1Turn &&
        client.rooms.has(`${gameId}-${GameUserType.Player2}`))
    ) {
      this.logger.log(`Client ${client.id} resumed game ${game.id}`);
      this.gamesService.resumeGame(gameId);
    }
  }

  @SubscribeMessage('moveClubStart')
  async handleMoveClubStart(client: Socket, { gameId, up }: MoveClubStartDto) {
    const game: Game = await this.gamesService.findOne(gameId);
    if (!game) return;

    if (client.rooms.has(`${gameId}-${GameUserType.Player1}`))
      this.gamesService.moveClubStart(gameId, true, up);
    else if (client.rooms.has(`${gameId}-${GameUserType.Player2}`))
      this.gamesService.moveClubStart(gameId, false, up);
  }

  @SubscribeMessage('moveClubStop')
  async handleMoveClubStop(client: Socket, { gameId }: MoveClubStopDto) {
    const game: Game = await this.gamesService.findOne(gameId);
    if (!game) return;

    if (client.rooms.has(`${gameId}-${GameUserType.Player1}`))
      this.gamesService.moveClubStop(gameId, true);
    else if (client.rooms.has(`${gameId}-${GameUserType.Player2}`))
      this.gamesService.moveClubStop(gameId, false);
  }
}
