import {
  Controller,
  Delete,
  Logger,
  Put,
  Session,
  UnauthorizedException,
} from '@nestjs/common';
import { MatchMakingGamesService } from './matchMakingGames.service';

@Controller('matchMaking')
export class MatchMakingGamesController {
  private logger: Logger = new Logger('MatchMakingGamesController');

  constructor(private matchMakingGamesService: MatchMakingGamesService) {}

  @Put()
  async addUserToQueue(@Session() session: Record<string, any>): Promise<void> {
    const userId = session.userId;
    if (!userId) {
      throw new UnauthorizedException();
    }
    await this.matchMakingGamesService.addUserToQueue(userId);
  }

  @Delete()
  async removeUserFromQueue(
    @Session() session: Record<string, any>,
  ): Promise<void> {
    const userId = session.userId;
    if (!userId) {
      throw new UnauthorizedException();
    }
    await this.matchMakingGamesService.removeUserFromQueue(userId);
  }
}
