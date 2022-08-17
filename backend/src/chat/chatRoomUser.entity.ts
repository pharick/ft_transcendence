import {
  Column,
  Entity,
  Index,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { ChatRoom } from './chatRoom.entity';
import { User } from '../users/user.entity';

@Entity()
@Index(['room', 'user'], { unique: true })
export class ChatRoomUser {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => ChatRoom)
  room: ChatRoom;

  @ManyToOne(() => User)
  user: User;

  @Column({ default: false })
  isBanned: boolean;

  @Column({ default: false })
  isAdmin: boolean;
}
