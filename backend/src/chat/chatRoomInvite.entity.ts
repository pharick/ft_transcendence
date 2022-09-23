import { Entity, Index, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { User } from '../users/user.entity';
import { ChatRoom } from './chatRoom.entity';

@Entity()
@Index(['user', 'room'], { unique: true })
export class ChatRoomInvite {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => User)
  inviter: User;

  @ManyToOne(() => User)
  user: User;

  @ManyToOne(() => ChatRoom)
  room: ChatRoom;
}
