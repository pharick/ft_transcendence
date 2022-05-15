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
  ballRadius: number;
  ballX: number;
  ballY: number;
  clubWidth: number;
  clubHeight: number;
  club1Pos: number;
  club2Pos: number;
}
