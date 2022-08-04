export interface User {
  id: number;
  ecole42Id: number;
  username: string;
  rank: number;
  prevRank: number;
}

export interface Game {
  id: string;
  fieldWidth: number;
  fieldHeight: number;
  player1: User;
  player2: User;
  score1: number;
  score2: number;
  durationMs: number;
  isRanked: boolean;
}

export interface GameFrame {
  ballRadius: number;
  ballX: number;
  ballY: number;
  clubWidth: number;
  clubHeightLeft: number;
  clubHeightRight: number;
  club1Pos: number;
  club2Pos: number;
  score1: number;
  score2: number;
  isPaused: boolean;
  isPlayer1Turn: boolean;
  durationMs: number;
  isCompleted: boolean;
}

export interface CompletedGame {
  id: number;
  date: Date;
  score1: number;
  score2: number;
  duration: number;
  player1: User;
  player2: User;
  isRanked: boolean;
}
