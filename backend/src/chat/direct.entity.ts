import {
  Column,
  Entity,
  Index,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { User } from '../users/user.entity';
import { ChatRoom } from './chatRoom.entity';

@Entity()
@Index(['user1', 'user2'], { unique: true })
export class Direct {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => User)
  user1: User;

  @ManyToOne(() => User)
  user2: User;

  @Column({ default: false })
  user1Blocked: boolean;

  @Column({ default: false })
  user2Blocked: boolean;

  @ManyToOne(() => ChatRoom)
  chatRoom: ChatRoom;
}
