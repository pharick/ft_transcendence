import { Controller, Get, Logger, Param, ParseIntPipe, Put, Session, UnauthorizedException } from '@nestjs/common';
import { MatchMakingGamesService } from './matchMakingGames.service';
import { GameInfo } from '../game/games.interfaces';

@Controller('matchMaking')
export class MatchMakingGamesController {
  private logger: Logger = new Logger('MatchMakingGamesController');

  constructor(private matchMakingGamesService: MatchMakingGamesService) {}

  @Get('gamer/:userId')
  findByOne(@Param('userId', new ParseIntPipe()) userId: number): number {
    this.logger.log(`search the game for the user ${userId}`);
    return this.matchMakingGamesService.findByOne(userId);
  }

  @Put()
  async createMatchMakingGame(
    @Session() session: Record<string, any>,
  ): Promise<GameInfo> {
    const userId = session.userId;
    if (!userId) {
      throw new UnauthorizedException();
    }
    return await this.matchMakingGamesService.createMatchMakingGame(userId);
  }
}
