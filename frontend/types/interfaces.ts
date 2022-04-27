export interface User {
  id: number;
  username: string;
  isActive: boolean;
}

export interface GameInfo {
  gameId: string;
  player1?: User;
  player2?: User;
}

export interface FrameInfo {
  ballX: number;
  ballY: number;
  ballRadius: number;
  club1Pos: number;
  club2Pos: number;
}
