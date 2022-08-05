import { Injectable, Logger } from '@nestjs/common';
import { GameFrame } from './games.interfaces';
import { Game } from './games.interfaces';
import { UsersService } from '../users/users.service';
import { randomUUID } from 'crypto';
import { CompletedGame } from '../completedGames/completedGame.entity';
import { CompletedGameDto } from '../completedGames/completedGame.dto';
import { CompletedGamesService } from '../completedGames/completedGames.service';
import { NotificationsService } from '../notifications/notifications.service';

const radians = (degrees: number) => {
  return degrees * (Math.PI / 180);
};

const random = (min: number, max: number) => {
  return Math.floor(Math.random() * (max - min + 1) + min);
};

class GameProcessor {
  private readonly _ballRadius: number = 4;
  private readonly _clubWidth: number = 8;
  private readonly _moveClubDelta: number = 20;
  private readonly _startingBallSpeed: number = 20;
  private readonly _ballSpeedDelta = 0.5;
  private readonly _frameDelta: number = 40;
  private readonly _max_score: number = 11;

  public readonly fieldWidth: number = 800;
  public readonly fieldHeight: number = 600;
  public readonly player1Id: number;
  public readonly player2Id: number;
  public readonly isRanked;

  private readonly _clubHeightRight: number;
  private readonly _clubHeightLeft: number;

  private _ballX: number;
  private _ballY: number;
  private _ballDirection: number;
  private _ballSpeed: number;
  private _club1Pos: number;
  private _club2Pos: number;
  private _club1Delta: number;
  private _club2Delta: number;
  private _score1: number;
  private _score2: number;
  private _isPlayer1Turn: boolean;
  private _gameTimer: NodeJS.Timer;
  private _durationMs: number;
  private _isCompleted: boolean;

  constructor(isRanked: boolean, player1Id: number, player2Id?: number) {
    this._ballSpeed = this._startingBallSpeed;
    this._club1Pos = this.fieldHeight / 2;
    this._club2Pos = this.fieldHeight / 2;
    this._club1Delta = 0;
    this._club2Delta = 0;
    this._score1 = 0;
    this._score2 = 0;
    this.player1Id = player1Id;
    this.player2Id = player2Id;
    this.isRanked = isRanked;

    this.newRound();

    this._clubHeightLeft = 80;
    this._clubHeightRight = this.isTraining ? this.fieldHeight : 80;
    this._durationMs = 0;
    this._isCompleted = false;
  }

  public get score1(): number {
    return this._score1;
  }

  public get score2(): number {
    return this._score2;
  }

  public get durationMs(): number {
    return this._durationMs;
  }

  public get isPlayer1Turn(): boolean {
    return this._isPlayer1Turn;
  }

  public get isTraining(): boolean {
    return !this.player2Id;
  }

  private get ballLeft(): number {
    return this._ballX - this._ballRadius;
  }

  private set ballLeft(n: number) {
    this._ballX = n + this._ballRadius;
  }

  private get ballRight(): number {
    return this._ballX + this._ballRadius;
  }

  private set ballRight(n: number) {
    this._ballX = n - this._ballRadius;
  }

  private get ballTop(): number {
    return this._ballY - this._ballRadius;
  }

  private set ballTop(n: number) {
    this._ballY = n + this._ballRadius;
  }

  private get ballBottom(): number {
    return this._ballY + this._ballRadius;
  }

  private set ballBottom(n: number) {
    this._ballY = n - this._ballRadius;
  }

  private get club1Top(): number {
    return this._club1Pos - this._clubHeightLeft / 2;
  }

  private get club1Bottom(): number {
    return this._club1Pos + this._clubHeightLeft / 2;
  }

  private get club1Right(): number {
    return this._ballRadius * 2 + this._clubWidth;
  }

  private get club2Top(): number {
    return this._club2Pos - this._clubHeightRight / 2;
  }

  private get club2Bottom(): number {
    return this._club2Pos + this._clubHeightRight / 2;
  }

  private get club2Left(): number {
    return this.fieldWidth - this._ballRadius * 2 - this._clubWidth;
  }

  moveClubStart(isClub1: boolean, up: boolean) {
    if (isClub1) {
      this._club1Delta = up ? -this._moveClubDelta : this._moveClubDelta;
    } else {
      this._club2Delta = up ? -this._moveClubDelta : this._moveClubDelta;
    }
  }

  moveClubStop(isClub1: boolean) {
    if (isClub1) {
      this._club1Delta = 0;
    } else {
      this._club2Delta = 0;
    }
  }

  private newRound() {
    this._ballSpeed = this._startingBallSpeed;
    this._ballX = this.fieldWidth / 2;
    this._ballY = this.fieldHeight / 2;
    this._club1Pos = this.fieldHeight / 2;
    this._club2Pos = this.fieldHeight / 2;
    if (this.isTraining) {
      this._isPlayer1Turn = true;
    } else {
      this._isPlayer1Turn = Boolean(random(0, 1));
    }
    this._ballDirection = this._isPlayer1Turn
      ? random(-30, 30)
      : random(180 - 30, 180 + 30);
    this.pauseGame();
  }

  private checkBordersCollisions() {
    if (this.ballTop < 0) {
      this.ballTop = 0;
      this._ballDirection = -this._ballDirection;
      this._ballSpeed += this._ballSpeedDelta;
    } else if (this.ballBottom > this.fieldHeight) {
      this.ballBottom = this.fieldHeight;
      this._ballDirection = -this._ballDirection;
      this._ballSpeed += this._ballSpeedDelta;
    }
  }

  private calculateClubRebound(delta: number) {
    if (delta <= 10) return 200;
    if (delta <= 20) return 190;
    if (delta <= 30) return 185;
    if (delta <= 40) return 180;
    if (delta <= 50) return 180;
    if (delta <= 60) return 175;
    if (delta <= 70) return 170;
    if (delta <= 80) return 160;
    return 180;
  }

  private checkClubsCollisions() {
    if (
      this.ballLeft < this.club1Right &&
      this.ballBottom > this.club1Top &&
      this.ballTop < this.club1Bottom
    ) {
      this.ballLeft = this.club1Right;
      this._ballDirection =
        this.calculateClubRebound(this.club1Bottom - this.ballTop) -
        this._ballDirection;
    }
    if (
      this.ballRight > this.club2Left &&
      this.ballBottom > this.club2Top &&
      this.ballTop < this.club2Bottom
    ) {
      this.ballRight = this.club2Left;
      this._ballDirection =
        this.calculateClubRebound(this.club1Bottom - this.ballTop) -
        this._ballDirection;
    }
  }

  private checkGoals() {
    if (this.ballLeft > this.fieldWidth) {
      this._score1++;
      this.newRound();
    }
    if (this.ballRight < 0) {
      this._score2++;
      this.newRound();
    }
    if (this._score1 >= this._max_score || this._score2 >= this._max_score) {
      this._isCompleted = true;
    }
  }

  private moveClubs() {
    if (
      (this._club1Delta < 0 && this.club1Top > this._ballRadius * 3) ||
      (this._club1Delta > 0 &&
        this.club1Bottom < this.fieldHeight - this._ballRadius * 3)
    )
      this._club1Pos += this._club1Delta;

    if (
      (this._club2Delta < 0 && this.club2Top > this._ballRadius * 3) ||
      (this._club2Delta > 0 &&
        this.club2Bottom < this.fieldHeight - this._ballRadius * 3)
    )
      this._club2Pos += this._club2Delta;
  }

  calculateNextFrame() {
    this._ballX += Math.cos(radians(this._ballDirection)) * this._ballSpeed;
    this._ballY += Math.sin(radians(this._ballDirection)) * this._ballSpeed;

    this.checkBordersCollisions();
    this.checkClubsCollisions();
    this.checkGoals();
    this.moveClubs();

    this._durationMs += this._frameDelta;

    if (this._score1 == this._max_score || this._score2 == this._max_score) {
      this._isCompleted = true;
    }
  }

  resumeGame() {
    if (this._gameTimer) return;
    this._gameTimer = setInterval(() => {
      this.calculateNextFrame();
    }, this._frameDelta);
  }

  pauseGame() {
    if (this._gameTimer) {
      clearInterval(this._gameTimer);
      this._gameTimer = null;
    }
  }

  getNextFrame(): GameFrame {
    return {
      ballRadius: this._ballRadius,
      ballX: this._ballX,
      ballY: this._ballY,
      clubWidth: this._clubWidth,
      clubHeightLeft: this._clubHeightLeft,
      clubHeightRight: this._clubHeightRight,
      club1Pos: this._club1Pos,
      club2Pos: this._club2Pos,
      score1: this._score1,
      score2: this._score2,
      isPaused: !this._gameTimer,
      isPlayer1Turn: this._isPlayer1Turn,
      durationMs: this._durationMs,
      isCompleted: this._isCompleted,
    };
  }
}

@Injectable()
export class GamesService {
  private logger = new Logger('GamesService');
  private gameProcessors = new Map<string, GameProcessor>();

  constructor(
    private usersService: UsersService,
    private completedGamesService: CompletedGamesService,
    private notificationsService: NotificationsService,
  ) {}

  async create(
    isRanked: boolean,
    player1Id: number,
    player2Id?: number,
  ): Promise<Game> {
    const player1 = await this.usersService.findOne(player1Id);
    const player2 = player2Id
      ? await this.usersService.findOne(player2Id)
      : undefined;
    if (!player1) return undefined;
    const gameId = randomUUID();
    this.gameProcessors.set(
      gameId,
      new GameProcessor(false, player1.id, player2?.id),
    );
    await this.notificationsService.send(player1.id);
    await this.notificationsService.send(player2?.id);
    return this.findOne(gameId);
  }

  async findAll(): Promise<Game[]> {
    return await Promise.all(
      Array.from(this.gameProcessors.keys()).map(
        async (id) => await this.findOne(id),
      ),
    );
  }

  async findAllByUser(userId: number): Promise<Game[]> {
    const games = await this.findAll();
    return games.filter(
      (game) => game.player1.id == userId || game.player2?.id == userId,
    );
  }

  async findOne(id: string): Promise<Game> {
    const gameProcessor = this.gameProcessors.get(id);
    if (!gameProcessor) return undefined;
    return {
      id,
      fieldWidth: gameProcessor.fieldWidth,
      fieldHeight: gameProcessor.fieldHeight,
      player1: await this.usersService.findOne(gameProcessor.player1Id),
      player2: gameProcessor.player2Id
        ? await this.usersService.findOne(gameProcessor.player2Id)
        : undefined,
      score1: gameProcessor.score1,
      score2: gameProcessor.score2,
      durationMs: gameProcessor.durationMs,
      isPlayer1Turn: gameProcessor.isPlayer1Turn,
      isRanked: gameProcessor.isRanked,
    };
  }

  getNextFrame(gameId: string): GameFrame {
    return this.gameProcessors.get(gameId)?.getNextFrame();
  }

  async endGame(gameId: string): Promise<CompletedGame> {
    const game = await this.findOne(gameId);
    if (!game) return;
    const completedGame: CompletedGameDto = {
      score1: game.score1,
      score2: game.score2,
      duration: Math.round(game.durationMs / 1000),
      player1: game.player1,
      player2: game.player2,
      isRanked: game.isRanked,
    };
    this.gameProcessors.delete(game.id);

    if (game.isRanked) {
      await this.usersService.updateRank(
        game.player1.id,
        game.score1 - game.score2,
      );
      await this.usersService.updateRank(
        game.player2.id,
        game.score2 - game.score1,
      );
    }
    await this.notificationsService.send(game.player1.id);
    await this.notificationsService.send(game.player2?.id);
    return await this.completedGamesService.create(completedGame);
  }

  resumeGame(id: string) {
    this.gameProcessors.get(id)?.resumeGame();
  }

  pauseGame(id: string) {
    this.gameProcessors.get(id)?.pauseGame();
  }

  moveClubStart(gameId: string, isClub1: boolean, up: boolean) {
    this.gameProcessors.get(gameId)?.moveClubStart(isClub1, up);
  }

  moveClubStop(gameId: string, isClub1: boolean) {
    this.gameProcessors.get(gameId)?.moveClubStop(isClub1);
  }
}
