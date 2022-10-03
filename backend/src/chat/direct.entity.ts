import { Entity, Index, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
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

  @ManyToOne(() => ChatRoom)
  chatRoom: ChatRoom;
}
