import { Injectable, Logger } from '@nestjs/common';

@Injectable()
export class MatchMakingGamesService {
  private logger: Logger = new Logger('MatchMakingGamesService');

  //private matchPlayers[]: number;

  findByOne(userId: number): number | null {
    this.logger.log(`need a pair for ${userId}`);
    return null;
  }
}
