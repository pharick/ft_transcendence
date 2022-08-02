import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ nullable: true })
  ecole42Id: number;

  @Column({ unique: true })
  username: string;

  @Column({ default: 0 })
  rank: number;

  @Column({ default: 0 })
  prevRank: number;

  // @OneToMany(() => PendingGame, (hostGame) => hostGame.hostUser)
  // pendingHostGames: PendingGame[];
  //
  // @OneToMany(() => PendingGame, (guestGame) => guestGame.hostUser)
  // pendingGuestGames: PendingGame[];
  //
  // @OneToMany(() => CompletedGame, (hostGame) => hostGame.hostUser)
  // completedHostGames: CompletedGame[];
  //
  // @OneToMany(() => CompletedGame, (guestGame) => guestGame.hostUser)
  // completedGuestGames: CompletedGame[];
  //
  // @OneToMany(() => ChatRoomUser, (chatRoomUser) => chatRoomUser.user)
  // chatRooms: ChatRoomUser[];
}
