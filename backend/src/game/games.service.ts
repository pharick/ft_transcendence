import { Injectable } from '@nestjs/common';
import { v4 as uuid4 } from 'uuid';

import { GameInfo } from './games.interfaces';
import { FrameInfo } from './games.interfaces';
import { UsersService } from '../users/users.service';
import { User } from '../users/user.entity';

const radians = (degrees: number) => {
  return degrees * (Math.PI / 180);
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
  private player2Id: number;

  private gameTimer: NodeJS.Timer;

  constructor(player1Id: number) {
    this.ballX = this.fieldWidth / 2;
    this.ballY = this.fieldHeight / 2;
    this.ballDirection = 20;
    this.ballSpeed = 5;
    this.club1Pos = this.fieldHeight / 2;
    this.club2Pos = this.fieldHeight / 2;
    this.club1Delta = 0;
    this.club2Delta = 0;
    this.player1Id = player1Id;
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

  private get club1Top() {
    return this.club1Pos - this.clubHeight / 2;
  }

  private get club1Bottom() {
    return this.club1Pos + this.clubHeight / 2;
  }

  private get club2Top() {
    return this.club2Pos - this.clubHeight / 2;
  }

  private get club2Bottom() {
    return this.club2Pos + this.clubHeight / 2;
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

  calculateNextFrame(): void {
    this.ballX += Math.cos(radians(this.ballDirection)) * this.ballSpeed;
    this.ballY += Math.sin(radians(this.ballDirection)) * this.ballSpeed;

    if (this.ballLeft < 0) {
      this.ballLeft = 0;
      this.ballDirection = 180 - this.ballDirection;
    }
    if (this.ballTop < 0) {
      this.ballTop = 0;
      this.ballDirection = -this.ballDirection;
    }
    if (this.ballRight > this.fieldWidth) {
      this.ballRight = this.fieldWidth;
      this.ballDirection = 180 - this.ballDirection;
    }
    if (this.ballBottom > this.fieldHeight) {
      this.ballBottom = this.fieldHeight;
      this.ballDirection = -this.ballDirection;
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

    // this.ballSpeed += 0.001;
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
    };
  }
}

@Injectable()
export class GamesService {
  private games: Record<string, Game> = {};

  constructor(private usersService: UsersService) {}

  async findAll(): Promise<GameInfo[]> {
    return await Promise.all(
      Object.entries(this.games).map(
        async ([gameId]) => await this.findOne(gameId),
      ),
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
      player1: player1,
      player2: player2,
    };
  }

  async createNewGame(player1Id: number): Promise<GameInfo> {
    const gameId: string = uuid4();
    this.games[gameId] = new Game(player1Id);
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
