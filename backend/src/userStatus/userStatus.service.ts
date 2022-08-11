import { Injectable } from '@nestjs/common';
import { UserStatusGateway } from './userStatus.gateway';
import { GamesGateway } from '../games/games.gateway';
import { UserStatus } from './userStatus.interface';

@Injectable()
export class UserStatusService {
  constructor(
    private userStatusGateway: UserStatusGateway,
    private gamesGateway: GamesGateway,
  ) {}

  findOne(userId: number): UserStatus {
    const isOnline = this.userStatusGateway.server.adapter.rooms.has(
      `user-${userId}`,
    );
    const isInGame = this.gamesGateway.server.adapter.rooms.has(
      `user-${userId}`,
    );
    if (isInGame) return UserStatus.InGame;
    if (isOnline) return UserStatus.Online;
    return UserStatus.Offline;
  }
}
