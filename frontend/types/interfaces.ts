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

export interface GameInfo {
  gameId: string;
  player1: UserInfo;
  player2: UserInfo;
}

export interface FrameInfo {
  ballRadius: number;
  ballX: number;
  ballY: number;
  clubWidth: number;
  clubHeight: number;
  club1Pos: number;
  club2Pos: number;
}
