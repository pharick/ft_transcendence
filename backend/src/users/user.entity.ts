import { Entity, Column, PrimaryGeneratedColumn, Index } from "typeorm";

@Entity()
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Index()
  @Column({ unique: true })
  username: string;

  @Column({ default: true })
  isActive: boolean;
}
