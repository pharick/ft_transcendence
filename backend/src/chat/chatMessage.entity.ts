import {
  Column,
  CreateDateColumn,
  Entity,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { User } from '../users/user.entity';
import { ChatRoom } from './chatRoom.entity';

@Entity()
export class ChatMessage {
  @PrimaryGeneratedColumn()
  id: number;

  @CreateDateColumn({ type: 'timestamptz' })
  date: Date;

  @ManyToOne(() => User)
  user: User;

  @ManyToOne(() => ChatRoom, (room) => room.messages, { nullable: true })
  room: ChatRoom;

  @Column()
  text: string;
}
