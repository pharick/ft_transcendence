import { Injectable, Logger } from '@nestjs/common';
import { v4 as uuid4 } from 'uuid';

import { FieldInfo, GameInfo } from './games.interfaces';
import { FrameInfo } from './games.interfaces';
import { UsersService } from '../users/users.service';
import { User } from '../users/user.entity';

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
  private readonly clubHeight: number = 80;
  private readonly moveClubDelta: number = 10;

  private ballX: number;
  private ballY: number;
  private ballDirection: number;
  private ballSpeed: number;

  private club1Pos: number;
  private club2Pos: number;

  private club1Delta: number;
  private club2Delta: number;

  private readonly player1Id: number;
  private readonly player2Id: number;

  private score1: number;
  private score2: number;

  private gameTimer: NodeJS.Timer;

  constructor(player1Id: number, player2Id: number) {
    this.ballSpeed = 5;
    this.club1Pos = this.fieldHeight / 2;
    this.club2Pos = this.fieldHeight / 2;
    this.club1Delta = 0;
    this.club2Delta = 0;
    this.player1Id = player1Id;
    this.player2Id = player2Id;
    this.score1 = 0;
    this.score2 = 0;
    this.newRound(!!random(0, 1));
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
    return this.club1Pos - this.clubHeight / 2;
  }

  private get club1Bottom(): number {
    return this.club1Pos + this.clubHeight / 2;
  }

  private get club1Right(): number {
    return this.ballRadius * 2 + this.clubWidth;
  }

  private get club2Top(): number {
    return this.club2Pos - this.clubHeight / 2;
  }

  private get club2Bottom(): number {
    return this.club2Pos + this.clubHeight / 2;
  }

  private get club2Left(): number {
    return this.fieldWidth - this.ballRadius * 2 - this.clubWidth;
  }

  get fieldInfo(): FieldInfo {
    return {
      width: this.fieldWidth,
      height: this.fieldHeight,
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

  newRound(player1Wins: boolean): void {
    this.ballX = this.fieldWidth / 2;
    this.ballY = this.fieldHeight / 2;
    this.ballDirection = player1Wins
      ? random(-30, 30)
      : random(180 - 30, 180 + 30);
    this.pauseGame();
  }

  calculateNextFrame(): void {
    this.ballX += Math.cos(radians(this.ballDirection)) * this.ballSpeed;
    this.ballY += Math.sin(radians(this.ballDirection)) * this.ballSpeed;

    if (this.ballTop < 0) {
      this.ballTop = 0;
      this.ballDirection = -this.ballDirection;
    }
    if (this.ballBottom > this.fieldHeight) {
      this.ballBottom = this.fieldHeight;
      this.ballDirection = -this.ballDirection;
    }

    if (
      this.ballLeft < this.club1Right &&
      this.ballBottom > this.club1Top &&
      this.ballTop < this.club1Bottom
    ) {
      this.ballLeft = this.club1Right;
      this.ballDirection = 180 - this.ballDirection;
    }
    if (
      this.ballRight > this.club2Left &&
      this.ballBottom > this.club2Top &&
      this.ballTop < this.club2Bottom
    ) {
      this.ballRight = this.club2Left;
      this.ballDirection = 180 - this.ballDirection;
    }

    if (this.ballLeft > this.fieldWidth) {
      this.score1++;
      this.newRound(true);
    }
    if (this.ballRight < 0) {
      this.score2++;
      this.newRound(false);
    }

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

  isGameRunning(): boolean {
    return !!this.gameTimer;
  }

  getPlayer1Id(): number {
    return this.player1Id;
  }

  getPlayer2Id(): number {
    return this.player2Id;
  }

  getNextFrame(): FrameInfo {
    return {
      ballRadius: this.ballRadius,
      ballX: this.ballX,
      ballY: this.ballY,
      clubWidth: this.clubWidth,
      clubHeight: this.clubHeight,
      club1Pos: this.club1Pos,
      club2Pos: this.club2Pos,
      score1: this.score1,
      score2: this.score2,
    };
  }
}

@Injectable()
export class GamesService {
  private logger: Logger = new Logger('GamesService');

  private games: Record<string, Game> = {};
  private users: Record<number, string[]> = {};

  constructor(private usersService: UsersService) {}

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

    const player1Id = this.games[gameId].getPlayer1Id();
    const player2Id = this.games[gameId].getPlayer2Id();
    const player1: User = await this.usersService.findOne(player1Id);
    const player2: User = await this.usersService.findOne(player2Id);

    return {
      gameId: gameId,
      field: this.games[gameId].fieldInfo,
      player1: player1,
      player2: player2,
    };
  }

  private saveGameForUser(userId: number, gameId: string) {
    if (!(userId in this.users)) this.users[userId] = [];
    this.users[userId].push(gameId);
  }

  async createNewGame(player1Id: number, player2Id: number): Promise<GameInfo> {
    const gameId: string = uuid4();
    this.games[gameId] = new Game(player1Id, player2Id);
    this.saveGameForUser(player1Id, gameId);
    this.saveGameForUser(player2Id, gameId);
    return this.findOne(gameId);
  }

  getNextFrame(gameId: string): FrameInfo | null {
    if (!(gameId in this.games)) return null;
    return this.games[gameId].getNextFrame();
  }

  toggleGameRunning(gameId: string) {
    if (!(gameId in this.games)) return;
    if (this.games[gameId].isGameRunning()) {
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
