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
  ForbiddenException,
} from '@nestjs/common';

import { GamesService } from './games.service';
import { GameInfo } from './games.interfaces';
import { PendingGamesGateway } from '../pendingGames/pendingGames.gateway';

@Controller('games')
export class GamesController {
  private logger: Logger = new Logger('GamesController');

  constructor(
    private gamesService: GamesService,
    private pendingGamesGateway: PendingGamesGateway,
  ) {}

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

  @Post(':gameId/resume')
  resumeGame(
    @Param('gameId') gameId: string,
    @Session() session: Record<string, any>,
  ) {
    const userId = session.userId;
    if (!this.gamesService.resumeGame(gameId, userId))
      throw new ForbiddenException();
  }

  @Put()
  async createTestGame(
    @Session() session: Record<string, any>,
  ): Promise<GameInfo> {
    const userId = session.userId;
    if (!userId) {
      throw new UnauthorizedException();
    }
    const game = await this.gamesService.createNewGame(userId, null, false);
    this.pendingGamesGateway.server.emit('update');
    return game;
  }
}
