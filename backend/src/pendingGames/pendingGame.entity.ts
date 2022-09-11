import {
  Entity,
  PrimaryGeneratedColumn,
  ManyToOne,
  Index,
  Column,
} from 'typeorm';
import { User } from '../users/user.entity';

@Entity()
@Index(['player1', 'player2'], { unique: true })
export class PendingGame {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => User)
  player1: User;

  @ManyToOne(() => User)
  player2: User;

  @Column()
  mode: number;
}
