import { Injectable, Logger } from '@nestjs/common';
import { GamesService } from '../games/games.service';
import { UsersService } from '../users/users.service';
import { MatchMakingGamesGateway } from './matchMakingGames.gateway';

@Injectable()
export class MatchMakingGamesService {
  private logger: Logger = new Logger('MatchMakingGamesService');

  private readonly stepUpdate = 5000;
  private match: Record<number, Set<number>> = {};
  constructor(
    private gamesService: GamesService,
    private usersService: UsersService,
    private matchMakingGamesGateway: MatchMakingGamesGateway,
  ) {
    const timeoutId = setInterval(() => {
      this.choosePlayer();
    }, this.stepUpdate);
  }

  async findByOne(userId: number) {
    this.logger.log(`need a pair for ${userId}`);
    const userRank = (await this.usersService.findOne(userId)).rank;
    if (!(userRank in this.match)) {
      this.match[userRank] = new Set();
    }
    this.match[userRank].add(userId);
  }

  private async choosePlayer() {
    let tempId: number = null;
    let rankId: number = null;

    function informEveryone(tempId: number, item: number, gameId: string) {
      this.matchMakingGamesGateway.handleMessage(tempId, item, gameId);
    }

    for (const [rank, setId] of Object.entries(this.match)) {
      if (setId) {
        for (const item of setId.values()) {
          if (tempId === null) {
            tempId = item;
            rankId = parseInt(rank, 10);
            this.match[rank].delete(item);
          } else {
            const game = await this.gamesService.createNewGame(tempId, item);
            informEveryone(tempId, item, game.gameId);
            this.match[rank].delete(item);
            this.match[rankId].delete(tempId);
            tempId = null;
          }
        }
      }
    }
    if (tempId) {
      this.match[rankId].add(tempId);
    }
  }

  async createMatchMakingGame(userId: number) {
    await this.findByOne(userId);
    this.logger.log(`MatchMaking ${userId}`);
  }

  async remove(userId: number) {
    const userRank = (await this.usersService.findOne(userId)).rank;
    if (this.match[userRank].has(userId)) {
      this.match[userRank].delete(userId);
    }
  }
}
