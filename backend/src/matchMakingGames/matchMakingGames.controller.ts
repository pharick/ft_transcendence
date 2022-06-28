import { Controller, Get, Logger, Param, ParseIntPipe } from '@nestjs/common';
import { MatchMakingGamesService } from './matchMakingGames.service';

@Controller('matchMaking')
export class MatchMakingGamesController {
  private logger: Logger = new Logger('MatchMakingGamesController');

  constructor(private matchMakingGamesService: MatchMakingGamesService) {}

  @Get('gamer/:userId')
  findByOne(@Param('userId', new ParseIntPipe()) userId: number): number {
    this.logger.log(`search the game for the user ${userId}`);
    return this.matchMakingGamesService.findByOne(userId);
  }
}
