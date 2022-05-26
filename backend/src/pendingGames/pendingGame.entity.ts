import { Entity, PrimaryGeneratedColumn, ManyToOne, Index } from 'typeorm';
import { User } from '../users/user.entity';

@Entity()
@Index(['hostUser', 'guestUser'], { unique: true })
export class PendingGame {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => User, (user) => user.hostGames)
  hostUser: User;

  @ManyToOne(() => User, (user) => user.guestGames)
  guestUser: User;
}
