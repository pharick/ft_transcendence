import { Injectable, Logger } from '@nestjs/common';
import { GamesService } from '../games/games.service';
import { UsersService } from '../users/users.service';
import { MatchMakingGateway } from './matchMaking.gateway';

@Injectable()
export class MatchMakingService {
  private logger: Logger = new Logger('MatchMakingService');

  private readonly matchMakingDelta = 5000;
  private rankedQueue: Record<number, Set<number>> = {};

  // constructor(
  //   private gamesService: GamesService,
  //   private usersService: UsersService,
  //   private matchMakingGateway: MatchMakingGateway,
  // ) {
  //   setInterval(() => {
  //     this.matchPlayers().then();
  //   }, this.matchMakingDelta);
  // }

  // async addUserToQueue(userId: number): Promise<void> {
  //   const user = await this.usersService.findOne(userId);
  //   if (!this.rankedQueue[user.rank]) this.rankedQueue[user.rank] = new Set();
  //   this.rankedQueue[user.rank].add(userId);
  //   console.log(`rankQueue is`);
  //   console.log(this.rankedQueue);
  // }

  // private async createGame(
  //   player1Id: number,
  //   player2Id: number,
  // ): Promise<void> {
  //   const game = await this.gamesService.createNewGame(
  //     player1Id,
  //     player2Id,
  //     true,
  //   );
  //   console.log(game);
  //   this.matchMakingGateway.server.emit('newMatch', game);
  // }
  //
  // private async matchPlayers() {
  //   for (const [rankStr, playerIds] of Object.entries(this.rankedQueue)) {
  //     const rank: number = parseInt(rankStr, 10);
  //
  //     if (playerIds) {
  //       await this.matchOneRankPlayers(playerIds, rank);
  //     }
  //   }
  //
  //   for (const [rankStr, playerIds] of Object.entries(this.rankedQueue)) {
  //     const rank: number = parseInt(rankStr, 10);
  //     if (playerIds.size > 0) {
  //       await this.matchDifferentRankPlayers(playerIds, rank);
  //     }
  //   }
  // }

  // private async matchOneRankPlayers(
  //   playerIds: Set<number>,
  //   rank: number,
  // ): Promise<void> {
  //   const playerIdsArray = Array.from(playerIds);
  //   while (playerIdsArray.length >= 2) {
  //     const player1Id = playerIdsArray.pop();
  //     const player2Id = playerIdsArray.pop();
  //     await this.createGame(player1Id, player2Id);
  //     this.rankedQueue[rank].delete(player1Id);
  //     this.rankedQueue[rank].delete(player2Id);
  //   }
  // }

  // private async matchDifferentRankPlayers(
  //   playerIds: Set<number>,
  //   rank: number,
  // ): Promise<Set<number>> {
  //   const ranks = Object.entries(this.rankedQueue).filter(
  //     ([currentRank, playerIds]) =>
  //       playerIds.size > 0 && parseInt(currentRank) != rank,
  //   );
  //
  //   const deltas = ranks.map(([currentRank]) => [
  //     parseInt(currentRank, 10),
  //     Math.abs(parseInt(currentRank) - rank),
  //   ]);
  //
  //   if (deltas.length <= 0) return;
  //
  //   const [matchedRank, delta] = deltas.reduce((prev, current) => {
  //     if (!prev) return current;
  //     const [, currentDelta] = current;
  //     const [, prevDelta] = prev;
  //     return currentDelta < prevDelta ? current : prev;
  //   });
  //
  //   console.log(matchedRank);
  //   console.log(delta);
  //
  //   const playerIdsArray = Array.from(playerIds);
  //   const userId = playerIdsArray.pop();
  //   this.rankedQueue[matchedRank].delete(userId);
  //
  //   const matchedPlayerIdsArray = Array.from(this.rankedQueue[matchedRank]);
  //   const matchedUserId = matchedPlayerIdsArray.pop();
  //   this.rankedQueue[matchedRank].delete(matchedUserId);
  //
  //   await this.createGame(userId, matchedUserId);
  // }

  // async removeUserFromQueue(userId: number): Promise<void> {
  //   const user = await this.usersService.findOne(userId);
  //   this.rankedQueue[user.rank].delete(userId);
  // }
}
