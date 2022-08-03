import { User } from '../users/user.entity';

export interface Game {
  id: string;
  fieldWidth: number;
  fieldHeight: number;
  player1: User;
  player2: User;
  score1: number;
  score2: number;
  durationMs: number;
  isPlayer1Turn: boolean;
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
