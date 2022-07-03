import {
  Controller,
  Post,
  Get,
  Param,
  Logger,
  NotFoundException,
  Session,
  Put,
  UnauthorizedException,
} from '@nestjs/common';

import { GamesService } from './games.service';
import { GameInfo } from './games.interfaces';

@Controller('games')
export class GamesController {
  private logger: Logger = new Logger('GamesController');

  constructor(private gamesService: GamesService) {}

  @Get()
  findAll(): Promise<GameInfo[]> {
    return this.gamesService.findAll();
  }

  @Get('my')
  findMy(@Session() session: Record<string, any>): Promise<GameInfo[]> {
    const userId = session.userId;
    return this.gamesService.findMy(userId);
  }

  @Get(':gameId')
  async findOne(@Param('gameId') gameId: string): Promise<GameInfo> {
    const gameInfo: GameInfo = await this.gamesService.findOne(gameId);
    if (!gameInfo) throw new NotFoundException();
    return gameInfo;
  }

  @Post(':gameId/toggle')
  startGame(@Param('gameId') gameId: string) {
    this.logger.log(`Toggle game start: ${gameId}`);
    this.gamesService.resumeGame(gameId);
  }

  @Put()
  async createTestGame(
    @Session() session: Record<string, any>,
  ): Promise<GameInfo> {
    const userId = session.userId;
    if (!userId) {
      throw new UnauthorizedException();
    }
    return await this.gamesService.createNewGame(userId, null);
  }
}
