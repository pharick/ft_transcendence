import { Column, Entity, ManyToOne } from 'typeorm';
import { ChatRoom } from './chatRoom.entity';
import { User } from '../users/user.entity';

@Entity()
export class RoomUser {
  @ManyToOne(() => ChatRoom)
  room: ChatRoom;

  @ManyToOne(() => User)
  user: User;

  @Column()
  isBanned: boolean;

  @Column()
  isAdmin: boolean;
}
