export interface Player {
  id: number;
  username: string;
  avatar: string;
  rank?: number;
  prevRank?: number;
}

export interface Game {
  id: string;
  fieldWidth: number;
  fieldHeight: number;
  player1: Player;
  player2: Player;
  score1: number;
  score2: number;
  durationMs: number;
  status: GameStatus;
  isRanked: boolean;
  isTraining: boolean;
}

export enum GameStatus {
  Player1Serve,
  Player2Serve,
  OnGame,
}

export interface GameBarrier {
  width: number;
  height: number;
  x: number;
  y: number;
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
  status: GameStatus;
  durationMs: number;
  isCompleted: boolean;
  barriers: GameBarrier[];
}

export interface GameClients {
  watchers: Player[];
  player1online: boolean;
  player2online: boolean;
}
