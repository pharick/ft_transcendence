import { User } from '../users/user.entity';

export class ChatRoomDto {
  id: number;
  isPrivate: boolean;
  hostUser: User;
  guestUser: User;
}
