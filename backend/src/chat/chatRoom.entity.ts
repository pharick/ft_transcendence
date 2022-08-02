import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import { ChatMessage } from './chatMessage.entity';

@Entity()
export class ChatRoom {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @Column({ nullable: true, select: false })
  passwordHash: string;
  //
  // @OneToMany(() => ChatMessage, (message) => message.room)
  // messages: ChatMessage[];
  //
  // @OneToMany(() => ChatRoomUser, (chatRoomUser) => chatRoomUser.user)
  // users: ChatRoomUser[];
}
