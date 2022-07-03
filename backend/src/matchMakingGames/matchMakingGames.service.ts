import { Injectable, Logger } from '@nestjs/common';
import { GamesService } from '../game/games.service';
import { UsersService } from '../users/users.service';

@Injectable()
export class MatchMakingGamesService {
  private logger: Logger = new Logger('MatchMakingGamesService');

  private readonly stepUpdate = 5000;
  private match: Record<number, Set<number>> = {};
  constructor(
    private gamesService: GamesService,
    private usersService: UsersService,
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
    for (const [rank, setId] of Object.entries(this.match)) {
      if (setId) {
        for (const item of setId.values()) {
          if (tempId === null) {
            tempId = item;
            rankId = parseInt(rank, 10);
            this.match[rank].delete(item);
          } else {
            await this.gamesService.createNewGame(tempId, item);
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
    console.log(`${this.match}`);
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
