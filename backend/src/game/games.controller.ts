import { Controller, Post, Get, Param, Logger, Session, NotFoundException } from '@nestjs/common';

import { GamesService } from "./games.service";
import { GameInfo } from './games.interfaces';

@Controller('games')
export class GamesController {
  private logger: Logger = new Logger('GamesController');
  
  constructor(private gamesService: GamesService) {}

  @Get()
  findAll(): GameInfo[] {
    return this.gamesService.findAll();
  }

  @Get(':gameId')
  findOne(@Param('gameId') gameId: string): GameInfo {
    const gameInfo: GameInfo = this.gamesService.findOne(gameId);
    if (!gameInfo)
      throw new NotFoundException();
    return gameInfo;
  }

  @Post()
  create(@Session() session: Record<string, any>): GameInfo {
    this.logger.log(session.userId);
    return this.gamesService.createNewGame();
  }

  @Post(':gameId/toggle')
  toggleGameRunning(@Param() params) {
    this.logger.log(`Toggle game running: ${params.gameId}`);
    this.gamesService.toggleGameRunning(params.gameId);
  }
}
