import { User } from '../users/user.entity';

export interface GameInfo {
  gameId: string;
  player1: User;
  player2?: User;
}

export interface FrameInfo {
  ballX: number;
  ballY: number;
  ballRadius: number;
  club1Pos: number;
  club2Pos: number;
}
