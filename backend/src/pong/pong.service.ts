import { Injectable } from '@nestjs/common';

import { FrameInfo } from './interfaces';

@Injectable()
export class PongService {
  private ballX: number = 0;
  private ballY: number = 0;

  getNextFrame(): FrameInfo {
    this.ballX += 1;
    this.ballY += 1;

    return {
      ballX: this.ballX,
      ballY: this.ballY,
    }
  }
}
