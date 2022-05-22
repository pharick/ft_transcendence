import {
  Controller,
  Post,
  Get,
  Param,
  Logger,
  Session,
  NotFoundException,
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

  @Get(':gameId')
  async findOne(@Param('gameId') gameId: string): Promise<GameInfo> {
    const gameInfo: GameInfo = await this.gamesService.findOne(gameId);
    if (!gameInfo) throw new NotFoundException();
    return gameInfo;
  }

  @Post()
  create(@Session() session: Record<string, any>): Promise<GameInfo> {
    const userId: number = session.userId;
    if (!userId) throw new UnauthorizedException();
    return this.gamesService.createNewGame(userId);
  }

  @Post(':gameId/toggle')
  toggleGameRunning(@Param('gameId') gameId: string) {
    this.logger.log(`Toggle game running: ${gameId}`);
    this.gamesService.toggleGameRunning(gameId);
  }
}
