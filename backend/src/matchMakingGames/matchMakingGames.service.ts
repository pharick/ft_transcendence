import { Injectable, Logger } from '@nestjs/common';
import { GamesService } from '../game/games.service';

@Injectable()
export class MatchMakingGamesService {
  private logger: Logger = new Logger('MatchMakingGamesService');

  constructor(private gamesService: GamesService) {}
  //private matchPlayers[]: number;

  findByOne(userId: number): number | null {
    this.logger.log(`need a pair for ${userId}`);
    // TODO (логика выбора игрока)
    return null;
  }

  async createMatchMakingGame(userId1: number) {
    const userId2 = this.findByOne(userId1);
    this.logger.log(`MatchMaking ${userId2}, ${userId1}`);
    return await this.gamesService.createNewGame(userId1, userId2);
  }
}
