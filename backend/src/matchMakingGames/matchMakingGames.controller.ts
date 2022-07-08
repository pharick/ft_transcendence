import {
  Controller,
  Delete,
  Get,
  HttpStatus,
  Logger,
  Param,
  ParseIntPipe,
  Put,
  Session,
  UnauthorizedException,
} from '@nestjs/common';
import { MatchMakingGamesService } from './matchMakingGames.service';

@Controller('matchMaking')
export class MatchMakingGamesController {
  private logger: Logger = new Logger('MatchMakingGamesController');

  constructor(private matchMakingGamesService: MatchMakingGamesService) {}

  @Get('gamer/:userId')
  async findByOne(
    @Param('userId', new ParseIntPipe()) userId: number,
  ): Promise<HttpStatus.CREATED> {
    this.logger.log(`search the game for the user ${userId}`);
    await this.matchMakingGamesService.findByOne(userId);
    return HttpStatus.CREATED;
  }

  @Put()
  async createMatchMakingGame(
    @Session() session: Record<string, any>,
  ): Promise<HttpStatus.CREATED> {
    const userId = session.userId;
    if (!userId) {
      throw new UnauthorizedException();
    }
    await this.matchMakingGamesService.createMatchMakingGame(userId);
    return HttpStatus.CREATED;
  }

  @Delete()
  remove(@Session() session: Record<string, any>) {
    this.matchMakingGamesService.remove(session.userId);
  }
}
