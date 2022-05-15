import { User } from '../users/user.entity';

export interface GameInfo {
  gameId: string;
  player1: User;
  player2?: User;
}

export interface FrameInfo {
  ballRadius: number;
  ballX: number;
  ballY: number;
  clubWidth: number;
  club1Pos: number;
  club2Pos: number;
}
