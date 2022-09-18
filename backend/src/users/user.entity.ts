import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ nullable: true })
  ecole42Id: number;

  @Column({ unique: true })
  username: string;

  @Column({ nullable: true })
  avatar: string;

  @Column({ default: 0 })
  rankedWins: number;

  @Column({ default: 0 })
  rankedLoses: number;

  @Column({ default: 0 })
  rank: number;

  @Column({ default: 0 })
  prevRank: number;
}
