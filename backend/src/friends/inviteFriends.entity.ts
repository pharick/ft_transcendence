import { Entity, Index, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { User } from '../users/user.entity';

@Entity()
@Index(['inviter', 'friend'], { unique: true })
export class InviteFriends {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => User)
  inviter: User;

  @ManyToOne(() => User)
  friend: User;
}
