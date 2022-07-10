export interface UserInfo {
  id: number;
  username: string;
  isActive: boolean;
  rank: number;
  oldRank: number;
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
  clubHeightLeft: number;
  clubHeightRight: number;
  club1Pos: number;
  club2Pos: number;
  scores: ScoreInfo;
  isPause: boolean;
  isPlayer1Turn: boolean;
  durationMs: number;
}

export interface CompletedGameInfo {
  id: number;
  score1: number;
  score2: number;
  duration: number;
  hostUser: UserInfo;
  guestUser: UserInfo;
}

export interface ChatMessage {
  id: number;
  date: Date;
  user: UserInfo;
  text: string;
}
