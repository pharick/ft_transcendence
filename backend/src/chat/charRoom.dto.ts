import UserInfo from '../users/userInfo.interface';

export class ChatRoomDto {
  id?: number;
  isPrivate: boolean;
  hostUser: UserInfo;
  guestUser: UserInfo;
}
