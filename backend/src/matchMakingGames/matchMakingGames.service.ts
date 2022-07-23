import { Injectable, Logger } from '@nestjs/common';
import { GamesService } from '../games/games.service';
import { UsersService } from '../users/users.service';
import { MatchMakingGamesGateway } from './matchMakingGames.gateway';

@Injectable()
export class MatchMakingGamesService {
  private logger: Logger = new Logger('MatchMakingGamesService');

  private readonly matchMakingDelta = 5000;
  private readonly maxRankDelta = 23;
  private rankedQueue: Record<number, Set<number>> = {};

  constructor(
    private gamesService: GamesService,
    private usersService: UsersService,
    private matchMakingGateway: MatchMakingGamesGateway,
  ) {
    setInterval(() => {
      this.matchPlayers().then();
    }, this.matchMakingDelta);
  }

  async addUserToQueue(userId: number): Promise<void> {
    const user = await this.usersService.findOne(userId);
    if (!this.rankedQueue[user.rank]) this.rankedQueue[user.rank] = new Set();
    this.rankedQueue[user.rank].add(userId);
    console.log(this.rankedQueue);
  }

  private async matchPlayers() {
    for (const [rankStr, playerIds] of Object.entries(this.rankedQueue)) {
      const rank: number = parseInt(rankStr, 10);

      if (playerIds) {
        this.rankedQueue[rank] = await this.matchOneRankPlayers(playerIds);
      }
    }
    this.matchDifferentRankPlayers();
  }

  private async matchOneRankPlayers(
    playerIds: Set<number>,
  ): Promise<Set<number>> {
    const playerIdsArray = Array.from(playerIds);
    while (playerIdsArray.length >= 2) {
      const player1Id = playerIdsArray.pop();
      const player2Id = playerIdsArray.pop();
      const game = await this.gamesService.createNewGame(
        player1Id,
        player2Id,
        true,
      );
      this.matchMakingGateway.server.emit('newMatch', game);
    }
    return new Set(playerIdsArray);
  }

  private async matchDifferentRankPlayers() {
    let tempRank: number;
    let tempId: number;
    for (const [rankStr, playerIds] of Object.entries(this.rankedQueue)) {
      if (playerIds) {
        const rank: number = parseInt(rankStr, 10);
        if (tempRank) {
          if (rank - tempRank < this.maxRankDelta) {
            const game = await this.gamesService.createNewGame(
              tempId,
              Array.from(playerIds)[0],
            );
            this.matchMakingGateway.server.emit('newMatch', game);
            this.rankedQueue[tempRank].delete(tempId);
            this.rankedQueue[rank].delete(Array.from(playerIds)[0]);
            tempId = null;
            tempRank = null;
          } else {
            tempId = Array.from(playerIds)[0];
            tempRank = rank;
          }
        } else {
          tempId = Array.from(playerIds)[0];
          tempRank = rank;
        }
      }
    }
  }

  async removeUserFromQueue(userId: number): Promise<void> {
    const user = await this.usersService.findOne(userId);
    this.rankedQueue[user.rank].delete(userId);
  }
}
