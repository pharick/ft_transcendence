import { User } from '../users/user.entity';

export class CompletedGameDto {
  score1: number;
  score2: number;
  duration: number;
  guestUser: User;
  hostUser: User;
  isRanked: boolean;
}
