import { Injectable, Logger } from '@nestjs/common';
import { v4 as uuid4 } from 'uuid';

import { FieldInfo, GameInfo, ScoreInfo } from './games.interfaces';
import { FrameInfo } from './games.interfaces';
import { UsersService } from '../users/users.service';
import { User } from '../users/user.entity';
import { CompletedGamesService } from '../completedGames/completedGames.service';
import { CompletedGameDto } from '../completedGames/completedGame.dto';
import { CompletedGame } from '../completedGames/completedGame.entity';

const radians = (degrees: number) => {
  return degrees * (Math.PI / 180);
};

const random = (min: number, max: number) => {
  return Math.floor(Math.random() * (max - min + 1) + min);
};

class Game {
  private readonly fieldWidth: number = 800;
  private readonly fieldHeight: number = 600;
  private readonly ballRadius: number = 4;
  private readonly clubWidth: number = 8;
  private readonly moveClubDelta: number = 10;

  private ballX: number;
  private ballY: number;
  private ballDirection: number;
  private ballSpeed: number;
  private clubHeightRight: number;
  private clubHeightLeft: number;

  private club1Pos: number;
  private club2Pos: number;

  private club1Delta: number;
  private club2Delta: number;

  private readonly _player1Id: number | null;
  private readonly _player2Id: number | null;

  private score1: number;
  private score2: number;

  private gameTimer: NodeJS.Timer;

  constructor(player1Id: number | null, player2Id: number | null) {
    this.ballSpeed = 5;
    this.club1Pos = this.fieldHeight / 2;
    this.club2Pos = this.fieldHeight / 2;
    this.club1Delta = 0;
    this.club2Delta = 0;
    this._player1Id = player1Id;
    this._player2Id = player2Id;
    this.score1 = 0;
    this.score2 = 0;
    this.newRound(!!random(0, 1));
    this.clubHeightLeft = player1Id === null ? this.fieldHeight : 80;
    this.clubHeightRight = player2Id === null ? this.fieldHeight : 80;
  }

  private get ballLeft(): number {
    return this.ballX - this.ballRadius;
  }

  private set ballLeft(n: number) {
    this.ballX = n + this.ballRadius;
  }

  private get ballRight(): number {
    return this.ballX + this.ballRadius;
  }

  private set ballRight(n: number) {
    this.ballX = n - this.ballRadius;
  }

  private get ballTop(): number {
    return this.ballY - this.ballRadius;
  }

  private set ballTop(n: number) {
    this.ballY = n + this.ballRadius;
  }

  private get ballBottom(): number {
    return this.ballY + this.ballRadius;
  }

  private set ballBottom(n: number) {
    this.ballY = n - this.ballRadius;
  }

  private get club1Top(): number {
    return this.club1Pos - this.clubHeightLeft / 2;
  }

  private get club1Bottom(): number {
    return this.club1Pos + this.clubHeightLeft / 2;
  }

  private get club1Right(): number {
    return this.ballRadius * 2 + this.clubWidth;
  }

  private get club2Top(): number {
    return this.club2Pos - this.clubHeightRight / 2;
  }

  private get club2Bottom(): number {
    return this.club2Pos + this.clubHeightRight / 2;
  }

  private get club2Left(): number {
    return this.fieldWidth - this.ballRadius * 2 - this.clubWidth;
  }

  get isGameRunning(): boolean {
    return !!this.gameTimer;
  }

  get player1Id(): number {
    return this._player1Id;
  }

  get player2Id(): number {
    return this._player2Id;
  }

  get fieldInfo(): FieldInfo {
    return {
      width: this.fieldWidth,
      height: this.fieldHeight,
    };
  }

  get scores(): ScoreInfo {
    return {
      player1: this.score1,
      player2: this.score2,
    };
  }

  moveClubStart(playerId: number, up: boolean): void {
    if (!playerId) return;
    if (playerId == this.player1Id)
      this.club1Delta = up ? -this.moveClubDelta : this.moveClubDelta;
    else if (playerId == this.player2Id)
      this.club2Delta = up ? -this.moveClubDelta : this.moveClubDelta;
  }

  moveClubStop(playerId: number): void {
    if (!playerId) return;
    if (playerId == this.player1Id) this.club1Delta = 0;
    else if (playerId == this.player2Id) this.club2Delta = 0;
  }

  private newRound(player1Wins: boolean): void {
    this.ballX = this.fieldWidth / 2;
    this.ballY = this.fieldHeight / 2;
    this.ballDirection = player1Wins
      ? random(-30, 30)
      : random(180 - 30, 180 + 30);
    this.pauseGame();
  }

  private checkBordersCollisions(): void {
    if (this.ballTop < 0) {
      this.ballTop = 0;
      this.ballDirection = -this.ballDirection;
    }
    if (this.ballBottom > this.fieldHeight) {
      this.ballBottom = this.fieldHeight;
      this.ballDirection = -this.ballDirection;
    }
  }

  private checkClubsCollisions(): void {
    function newBallDirection(delta: number) {
      if (delta <= 10 || delta >= 70) return 195;
      if (delta <= 20 || delta >= 60) return 190;
      if (delta <= 30 || delta >= 50) return 185;
      return 180;
    }

    if (
      this.ballLeft < this.club1Right &&
      this.ballBottom > this.club1Top &&
      this.ballTop < this.club1Bottom
    ) {
      this.ballLeft = this.club1Right;
      this.ballDirection =
        newBallDirection(this.club1Bottom - this.ballTop) - this.ballDirection;
      // this.ballDirection = 180 - this.ballDirection;
    }
    if (
      this.ballRight > this.club2Left &&
      this.ballBottom > this.club2Top &&
      this.ballTop < this.club2Bottom
    ) {
      this.ballRight = this.club2Left;
      this.ballDirection =
        newBallDirection(this.club1Bottom - this.ballTop) - this.ballDirection;
      // this.ballDirection = 180 - this.ballDirection;
    }
  }

  private checkGoals(): void {
    if (this.ballLeft > this.fieldWidth) {
      this.score1++;
      this.newRound(true);
    }
    if (this.ballRight < 0) {
      this.score2++;
      this.newRound(false);
    }
  }

  private moveClubs(): void {
    if (
      (this.club1Delta < 0 && this.club1Top > this.ballRadius * 3) ||
      (this.club1Delta > 0 &&
        this.club1Bottom < this.fieldHeight - this.ballRadius * 3)
    )
      this.club1Pos += this.club1Delta;

    if (
      (this.club2Delta < 0 && this.club2Top > this.ballRadius * 3) ||
      (this.club2Delta > 0 &&
        this.club2Bottom < this.fieldHeight - this.ballRadius * 3)
    )
      this.club2Pos += this.club2Delta;
  }

  calculateNextFrame(): void {
    this.ballX += Math.cos(radians(this.ballDirection)) * this.ballSpeed;
    this.ballY += Math.sin(radians(this.ballDirection)) * this.ballSpeed;

    this.checkBordersCollisions();
    this.checkClubsCollisions();
    this.checkGoals();
    this.moveClubs();
  }

  resumeGame(): void {
    if (this.gameTimer) return;
    this.gameTimer = setInterval(() => {
      this.calculateNextFrame();
    }, 10);
  }

  pauseGame(): void {
    if (this.gameTimer) {
      clearInterval(this.gameTimer);
      this.gameTimer = null;
    }
  }

  getNextFrame(): FrameInfo {
    return {
      ballRadius: this.ballRadius,
      ballX: this.ballX,
      ballY: this.ballY,
      clubWidth: this.clubWidth,
      clubHeightLeft: this.clubHeightLeft,
      clubHeightRight: this.clubHeightRight,
      club1Pos: this.club1Pos,
      club2Pos: this.club2Pos,
      scores: this.scores,
    };
  }
}

@Injectable()
export class GamesService {
  private logger: Logger = new Logger('GamesService');

  private games: Record<string, Game> = {};
  private users: Record<number, string[]> = {};

  constructor(
    private usersService: UsersService,
    private completedGamesService: CompletedGamesService,
  ) {}

  async findAll(): Promise<GameInfo[]> {
    return await Promise.all(
      Object.entries(this.games).map(
        async ([gameId]) => await this.findOne(gameId),
      ),
    );
  }

  async findMy(userId): Promise<GameInfo[]> {
    if (!(userId in this.users)) return [];
    this.logger.log(this.users[userId]);
    return await Promise.all(
      this.users[userId].map(async (gameId) => await this.findOne(gameId)),
    );
  }

  async findOne(gameId: string): Promise<GameInfo> {
    if (!(gameId in this.games)) return null;

    const player1Id = this.games[gameId].player1Id;
    const player2Id = this.games[gameId].player2Id;
    const player1: User = await this.usersService.findOne(player1Id);
    const player2: User = await this.usersService.findOne(player2Id);

    return {
      gameId: gameId,
      field: this.games[gameId].fieldInfo,
      player1: player1,
      player2: player2,
      scores: this.games[gameId].scores,
    };
  }

  private saveGameForUser(userId: number, gameId: string) {
    if (!(userId in this.users)) this.users[userId] = [];
    this.users[userId].push(gameId);
  }

  private removeGame(gameId: string) {
    delete this.games[gameId];
    for (const key of Object.keys(this.users)) {
      this.users[key] = this.users[key].filter((elem) => elem != gameId);
    }
  }

  async createNewGame(
    player1Id: number | null,
    player2Id: number | null,
  ): Promise<GameInfo> {
    const gameId: string = uuid4();
    this.games[gameId] = new Game(player1Id, player2Id);
    if (player1Id !== null) {
      this.saveGameForUser(player1Id, gameId);
    }
    if (player2Id !== null) {
      this.saveGameForUser(player2Id, gameId);
    }
    return this.findOne(gameId);
  }

  getNextFrame(gameId: string): FrameInfo | null {
    if (!(gameId in this.games)) return null;
    return this.games[gameId].getNextFrame();
  }

  async endGame(gameId: string): Promise<CompletedGame> {
    const game = this.games[gameId];
    const completedGame: CompletedGameDto = {
      score1: game.scores.player1,
      score2: game.scores.player2,
      duration: 0, // TODO
      hostUser: await this.usersService.findOne(game.player1Id),
      guestUser: await this.usersService.findOne(game.player2Id),
    };
    this.removeGame(gameId);
    return await this.completedGamesService.create(completedGame);
  }

  toggleGameRunning(gameId: string) {
    if (!(gameId in this.games)) return;
    if (this.games[gameId].isGameRunning) {
      this.games[gameId].pauseGame();
    } else {
      this.games[gameId].resumeGame();
    }
  }

  moveClubStart(gameId: number, playerId: number, up: boolean): void {
    if (!(gameId in this.games)) return;
    this.games[gameId].moveClubStart(playerId, up);
  }

  moveClubStop(gameId: number, playerId: number): void {
    if (!(gameId in this.games)) return;
    this.games[gameId].moveClubStop(playerId);
  }
}
