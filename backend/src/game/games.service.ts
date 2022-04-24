import { Injectable, NotFoundException } from '@nestjs/common';
import { v4 as uuid4 } from 'uuid';

import { GameInfo } from './games.interfaces';
import { FrameInfo } from './games.interfaces';

const radians = (degrees: number) => {
  return degrees * (Math.PI / 180);
};

class Game {
  private fieldWidth: number;
  private fieldHeight: number;

  private ballX: number;
  private ballY: number;
  private ballRadius: number;
  private ballDirection: number;
  private ballSpeed: number;

  private club1Pos: number;
  private club2Pos: number;

  private player1Id: number;
  private player2Id: number;

  private gameTimer: NodeJS.Timer;

  constructor() {
    this.fieldWidth = 800;
    this.fieldHeight = 600;
    this.ballX = this.fieldWidth / 2;
    this.ballY = this.fieldHeight / 2;
    this.ballRadius = 10;
    this.ballDirection = 20;
    this.ballSpeed = 5;
    this.club1Pos = this.fieldHeight / 2;
    this.club2Pos = this.fieldHeight / 2;
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

  moveClub1(delta: number) {
    this.club1Pos += delta;
  }

  moveClub2(delta: number) {
    this.club2Pos += delta;
  }

  resumeGame(): void {
    if (this.gameTimer)
      return;
    this.gameTimer = setInterval(() => {
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
      this.ballSpeed += 0.001;
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

  getNextFrame(): FrameInfo {
    return {
      ballX: this.ballX,
      ballY: this.ballY,
      ballRadius: this.ballRadius,
      club1Pos: this.club1Pos,
      club2Pos: this.club2Pos,
    }
  }
}

@Injectable()
export class GamesService {

  private games: Record<string, Game> = {};

  findAll(): GameInfo[] {
    return Object.entries(this.games).map(([gameId, game]) => (
      {
        gameId: gameId,
      }
    ));
  }

  findOne(gameId: string): GameInfo {
    if (!(gameId in this.games))
      return null;
    return {
      gameId: gameId,
    }
  }

  createNewGame(): GameInfo {
    const gameId: string = uuid4();
    this.games[gameId] = new Game();
    return {
      gameId: gameId,
    };
  }

  getNextFrame(game_id: string): FrameInfo | null {
    if (!(game_id in this.games)) return null;
    return this.games[game_id].getNextFrame();
  }

  toggleGameRunning(gameId: string) {
    if (!(gameId in this.games)) return;
    if (this.games[gameId].isGameRunning()) {
      this.games[gameId].pauseGame();
    } else {
      this.games[gameId].resumeGame();
    }
  }

}
