import { Entity, PrimaryGeneratedColumn, ManyToOne } from 'typeorm';
import { User } from '../users/user.entity';

@Entity()
export class PendingGame {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => User, (user) => user.hostGames)
  hostUser: User;

  @ManyToOne(() => User, (user) => user.guestGames)
  guestUser: User;
}
