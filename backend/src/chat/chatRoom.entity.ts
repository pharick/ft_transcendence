import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import { ChatMessage } from './chatMessage.entity';
import { ChatRoomUser } from './chatRoomUser.entity';

export enum ChatRoomType {
  Public,
  Private,
  Protected,
  Direct,
}

@Entity()
export class ChatRoom {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ unique: true })
  name: string;

  @Column()
  type: ChatRoomType;

  @Column({ nullable: true })
  passwordHash: string;

  @OneToMany(() => ChatRoomUser, (roomUser) => roomUser.room)
  users: ChatRoomUser[];

  @OneToMany(() => ChatMessage, (message) => message.room)
  messages: ChatMessage[];
}
