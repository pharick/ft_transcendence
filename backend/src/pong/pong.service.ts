import { Injectable } from '@nestjs/common';

import { FrameInfo } from './interfaces';

const pongProps = {
  fieldWidth: 800,
  fieldHeight: 600,
  ballRadius: 10,
  ballSpeed: 1,
  ballDirection: 45,
};

const radians = (degrees: number) => {
  return degrees * (Math.PI / 180);
};

@Injectable()
export class PongService {
  private ballX: number = 100;
  private ballY: number = 100;
  private ballDirection = pongProps.ballDirection;
  private ballSpeed = pongProps.ballSpeed;
  private club1Pos = 100;
  private club2Pos = 100;

  private get ballLeft(): number {
    return this.ballX - pongProps.ballRadius;
  }

  private set ballLeft(n: number) {
    this.ballX = n + pongProps.ballRadius;
  }

  private get ballRight(): number {
    return this.ballX + pongProps.ballRadius;
  }

  private set ballRight(n: number) {
    this.ballX = n - pongProps.ballRadius;
  }

  private get ballTop(): number {
    return this.ballY - pongProps.ballRadius;
  }

  private set ballTop(n: number) {
    this.ballY = n + pongProps.ballRadius;
  }

  private get ballBottom(): number {
    return this.ballY + pongProps.ballRadius;
  }

  private set ballBottom(n: number) {
    this.ballY = n - pongProps.ballRadius;
  }

  moveClub1(delta: number) {
    this.club1Pos += delta;
  }

  moveClub2(delta: number) {
    this.club2Pos += delta;
  }

  getNextFrame(): FrameInfo {
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
    if (this.ballRight > pongProps.fieldWidth) {
      this.ballRight = pongProps.fieldWidth;
      this.ballDirection = 180 - this.ballDirection;
    }
    if (this.ballBottom > pongProps.fieldHeight) {
      this.ballBottom = pongProps.fieldHeight;
      this.ballDirection = -this.ballDirection;
    }

    return {
      ballX: this.ballX,
      ballY: this.ballY,
      ballRadius: pongProps.ballRadius,
      club1Pos: this.club1Pos,
      club2Pos: this.club2Pos,
    }
  }
}
