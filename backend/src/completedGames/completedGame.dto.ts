import UserInfo from '../users/userInfo.interface';

export class CompletedGameDto {
  score1: number;
  score2: number;
  duration: number;
  guestUser: UserInfo;
  hostUser: UserInfo;
  isRanked: boolean;
}
