import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  Index,
  OneToMany,
} from 'typeorm';

import { PendingGame } from '../pendingGames/pendingGame.entity';
import { CompletedGame } from '../completedGames/completedGame.entity';
import { ChatRoomUser } from '../chat/chatRoomUser.entity';

@Entity()
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Index()
  @Column({ unique: true })
  username: string;

  @Column({ default: true })
  isActive: boolean;

  @Column({ default: 0 })
  rank: number;

  @Column({ default: 0 })
  oldRank: number;

  @OneToMany(() => PendingGame, (hostGame) => hostGame.hostUser)
  pendingHostGames: PendingGame[];

  @OneToMany(() => PendingGame, (guestGame) => guestGame.hostUser)
  pendingGuestGames: PendingGame[];

  @OneToMany(() => CompletedGame, (hostGame) => hostGame.hostUser)
  completedHostGames: CompletedGame[];

  @OneToMany(() => CompletedGame, (guestGame) => guestGame.hostUser)
  completedGuestGames: CompletedGame[];

  @OneToMany(() => ChatRoomUser, (chatRoomUser) => chatRoomUser.user)
  chatRooms: ChatRoomUser[];
}
