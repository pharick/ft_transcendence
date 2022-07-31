import {
  Controller,
  Post,
  Get,
  Param,
  Logger,
  NotFoundException,
  Put,
  ForbiddenException,
  Req,
  UseGuards,
} from '@nestjs/common';
import { Request } from 'express';

import { GamesService } from './games.service';
import { GameInfo } from './games.interfaces';
import { NotificationsGateway } from '../notifications/notifications.gateway';
import { AuthGuard } from '../auth/auth.guard';

@Controller('games')
export class GamesController {
  private logger: Logger = new Logger('GamesController');

  constructor(
    private gamesService: GamesService,
    private notificationsGateway: NotificationsGateway,
  ) {}

  @Get()
  findAll(): Promise<GameInfo[]> {
    return this.gamesService.findAll();
  }

  @Get('my')
  @UseGuards(AuthGuard)
  findMy(@Req() request: Request): Promise<GameInfo[]> {
    return this.gamesService.findMy(request.user.id);
  }

  @Get(':gameId')
  async findOne(@Param('gameId') gameId: string): Promise<GameInfo> {
    const gameInfo: GameInfo = await this.gamesService.findOne(gameId);
    if (!gameInfo) throw new NotFoundException();
    return gameInfo;
  }

  @Post(':gameId/resume')
  @UseGuards(AuthGuard)
  resumeGame(@Param('gameId') gameId: string, @Req() request: Request) {
    if (!this.gamesService.resumeGame(gameId, request.user.id))
      throw new ForbiddenException();
  }

  @Put()
  @UseGuards(AuthGuard)
  async createTestGame(@Req() request: Request): Promise<GameInfo> {
    const game = await this.gamesService.createNewGame(
      request.user.id,
      null,
      false,
    );
    this.notificationsGateway.server.emit('update');
    return game;
  }
}
