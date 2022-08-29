import {
  Column,
  Entity,
  Index,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { ChatRoom } from './chatRoom.entity';
import { User } from '../users/user.entity';

export enum ChatRoomUserType {
  Owner,
  Admin,
  Common,
}

@Entity()
@Index(['room', 'user'], { unique: true })
export class ChatRoomUser {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => ChatRoom)
  room: ChatRoom;

  @ManyToOne(() => User)
  user: User;

  @Column({ default: ChatRoomUserType.Common })
  type: ChatRoomUserType;

  @Column({ default: null })
  bannedUntil: Date;

  @Column({ default: null })
  mutedUntil: Date;
}
