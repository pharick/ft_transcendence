import { User } from '../users/user.entity';

export interface FieldInfo {
  width: number;
  height: number;
}

export interface ScoreInfo {
  player1: number;
  player2: number;
}

export interface GameInfo {
  gameId: string;
  field: FieldInfo;
  player1: User;
  player2: User;
  scores: ScoreInfo;
}

export interface FrameInfo {
  ballRadius: number;
  ballX: number;
  ballY: number;
  clubWidth: number;
  clubHeightLeft: number;
  clubHeightRight: number;
  club1Pos: number;
  club2Pos: number;
  scores: ScoreInfo;
  isPause: boolean;
}
