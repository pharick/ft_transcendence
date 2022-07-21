import {
  Column,
  Entity,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { User } from '../users/user.entity';
import { ChatMessage } from './chatMessage.entity';

@Entity()
export class ChatRoom {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ nullable: false })
  isPrivate: boolean;

  @Column({ nullable: true, select: false })
  passwordHash: string;

  @ManyToOne(() => User, (user) => user.hostPrivateChats, { nullable: true })
  hostUser: User;

  @ManyToOne(() => User, (user) => user.guestPrivateChats, { nullable: true })
  guestUser: User;

  @OneToMany(() => ChatMessage, (message) => message.room)
  messages: ChatMessage[];
}
