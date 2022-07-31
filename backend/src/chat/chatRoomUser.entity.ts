import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { User } from '../users/user.entity';
import { ChatRoom } from './chatRoom.entity';

@Entity()
export class ChatRoomUser {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => User, (user) => user.chatRooms)
  user: User;

  @ManyToOne(() => ChatRoom, (chatRoom) => chatRoom.users)
  chatRoom: ChatRoom;

  @Column({ default: false })
  isAdmin: boolean;
}
