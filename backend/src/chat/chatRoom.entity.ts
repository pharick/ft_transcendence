import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import { ChatMessage } from './chatMessage.entity';

export enum ChatRoomType {
  Public,
  Private,
  Protected,
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
  password: string;

  @OneToMany(() => ChatMessage, (message) => message.room)
  messages: ChatMessage[];
}
