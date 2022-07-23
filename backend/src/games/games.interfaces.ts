import UserInfo from '../users/userInfo.interface';

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
  player1: UserInfo;
  player2: UserInfo;
  scores: ScoreInfo;
  durationMs: number;
  isRanked: boolean;
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
  isPlayer1Turn: boolean;
  durationMs: number;
}
