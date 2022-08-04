import { User } from '../users/user.entity';

export class CompletedGameDto {
  score1: number;
  score2: number;
  duration: number;
  player1: User;
  player2: User;
  isRanked: boolean;
}
