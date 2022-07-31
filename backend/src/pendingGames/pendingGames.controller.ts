import {
  Body,
  ConflictException,
  Controller,
  Delete,
  ForbiddenException,
  Get,
  Logger,
  NotFoundException,
  Param,
  ParseIntPipe,
  Post,
  Put,
  Req,
  UnauthorizedException,
  UseGuards,
} from '@nestjs/common';
import { Request } from 'express';

import { PendingGamesService } from './pendingGames.service';
import { PendingGame } from './pendingGame.entity';
import { CreatePendingGameDto } from './pendingGames.dto';
import { UsersService } from '../users/users.service';
import { GamesService } from '../games/games.service';
import { GameInfo } from '../games/games.interfaces';
import { NotificationsGateway } from '../notifications/notifications.gateway';
import { AuthGuard } from '../auth/auth.guard';

@Controller('pending')
export class PendingGamesController {
  private logger: Logger = new Logger('PendingGamesController');

  constructor(
    private pendingGamesService: PendingGamesService,
    private gamesService: GamesService,
    private usersService: UsersService,
    private notificationsGateway: NotificationsGateway,
  ) {}

  @Get()
  findAll(): Promise<PendingGame[]> {
    return this.pendingGamesService.findAll();
  }

  @Get('host/:hostUserId')
  findByHost(
    @Param('hostUserId', new ParseIntPipe()) hostUserId: number,
  ): Promise<PendingGame[]> {
    return this.pendingGamesService.findByHost(hostUserId);
  }

  @Get('guest/:guestUserId')
  findByGuest(
    @Param('guestUserId', new ParseIntPipe()) guestUserId: number,
  ): Promise<PendingGame[]> {
    return this.pendingGamesService.findByGuest(guestUserId);
  }

  @Put()
  @UseGuards(AuthGuard)
  async create(
    @Req() request: Request,
    @Body() createPendingGameDto: CreatePendingGameDto,
  ): Promise<PendingGame> {
    const hostUserId: number = request.user.id;
    const guestUserId: number = createPendingGameDto.guestUserId;

    const pending = this.pendingGamesService
      .create(hostUserId, guestUserId)
      .catch((error) => {
        this.logger.error(error);
        throw new ConflictException();
      });
    this.notificationsGateway.server.emit('update');
    return pending;
  }

  @Post(':pendingGameId/accept')
  @UseGuards(AuthGuard)
  async accept(
    @Req() request: Request,
    @Param('pendingGameId', new ParseIntPipe()) pendingGameId: number,
  ): Promise<GameInfo> {
    const pending: PendingGame = await this.pendingGamesService.findOne(
      pendingGameId,
    );
    if (!pending) throw new NotFoundException();
    if (request.user.Id != pending.guestUser.id)
      throw new UnauthorizedException();
    await this.pendingGamesService.remove(pendingGameId);
    const game = this.gamesService.createNewGame(
      pending.hostUser.id,
      pending.guestUser.id,
      false,
    );
    this.notificationsGateway.server.emit('update');
    return game;
  }

  @Delete(':pendingGameId')
  @UseGuards(AuthGuard)
  async remove(
    @Req() request: Request,
    @Param('pendingGameId', new ParseIntPipe()) pendingGameId: number,
  ): Promise<void> {
    const pending = await this.pendingGamesService.findOne(pendingGameId);
    if (!pending) throw new NotFoundException();
    if (
      pending.hostUser.id != request.user.id &&
      pending.guestUser.id != request.user.id
    )
      throw new ForbiddenException();
    await this.pendingGamesService.remove(pendingGameId);
    this.notificationsGateway.server.emit('update');
  }
}
