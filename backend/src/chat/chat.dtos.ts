import { ChatRoom } from './chatRoom.entity';
import { User } from '../users/user.entity';

export class CreateChatRoomDto {
  name: string;
  password?: string;
}
