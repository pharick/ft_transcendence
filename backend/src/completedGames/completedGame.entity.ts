import {
  Column,
  CreateDateColumn,
  Entity,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { User } from '../users/user.entity';

@Entity()
export class CompletedGame {
  @PrimaryGeneratedColumn()
  id: number;

  @CreateDateColumn({ type: 'timestamptz' })
  date: Date;

  @Column()
  score1: number;

  @Column()
  score2: number;

  @Column()
  duration: number;

  @ManyToOne(() => User, (user) => user.completedHostGames)
  hostUser: User;

  @ManyToOne(() => User, (user) => user.completedGuestGames)
  guestUser: User;

  @Column()
  isRanked: boolean;
}
