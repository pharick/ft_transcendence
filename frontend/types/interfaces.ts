export interface UserInfo {
  id: number;
  username: string;
  isActive: boolean;
}

export interface PendingGame {
  id: number;
  hostUser: UserInfo;
  guestUser: UserInfo;
}

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
}

export interface FrameInfo {
  ballRadius: number;
  ballX: number;
  ballY: number;
  clubWidth: number;
  clubHeight: number;
  club1Pos: number;
  club2Pos: number;
  scores: ScoreInfo;
}
