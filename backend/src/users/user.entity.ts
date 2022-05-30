import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  Index,
  OneToMany,
} from 'typeorm';

import { PendingGame } from '../pendingGames/pendingGame.entity';

@Entity()
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Index()
  @Column({ unique: true })
  username: string;

  @Column({ default: true })
  isActive: boolean;

  @OneToMany(() => PendingGame, (hostGame) => hostGame.hostUser)
  hostGames: PendingGame[];

  @OneToMany(() => PendingGame, (guestGame) => guestGame.hostUser)
  guestGames: PendingGame[];
}
