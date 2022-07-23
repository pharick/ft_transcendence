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
  Session,
  UnauthorizedException,
} from '@nestjs/common';

import { PendingGamesService } from './pendingGames.service';
import { PendingGame } from './pendingGame.entity';
import { CreatePendingGameDto } from './pendingGames.dto';
import { UsersService } from '../users/users.service';
import { User } from '../users/user.entity';
import { GamesService } from '../games/games.service';
import { GameInfo } from '../games/games.interfaces';
import { PendingGamesGateway } from './pendingGames.gateway';

@Controller('pending')
export class PendingGamesController {
  private logger: Logger = new Logger('PendingGamesController');

  constructor(
    private pendingGamesService: PendingGamesService,
    private gamesService: GamesService,
    private usersService: UsersService,
    private pendingGamesGateway: PendingGamesGateway,
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
  async create(
    @Session() session: Record<string, any>,
    @Body() createPendingGameDto: CreatePendingGameDto,
  ): Promise<PendingGame> {
    const hostUserId: number = session.userId;
    const guestUserId: number = createPendingGameDto.guestUserId;

    const hostUser: User = await this.usersService.findOne(hostUserId);
    const guestUser: User = await this.usersService.findOne(guestUserId);

    if (!hostUserId) throw new UnauthorizedException();
    const pending = this.pendingGamesService
      .create(hostUser, guestUser)
      .catch((error) => {
        this.logger.error(error);
        throw new ConflictException();
      });
    this.pendingGamesGateway.server.emit('update');
    return pending;
  }

  @Post(':pendingGameId/accept')
  async accept(
    @Session() session: Record<string, any>,
    @Param('pendingGameId', new ParseIntPipe()) pendingGameId: number,
  ): Promise<GameInfo> {
    const pending: PendingGame = await this.pendingGamesService.findOne(
      pendingGameId,
    );
    if (!pending) throw new NotFoundException();
    if (session.userId != pending.guestUser.id)
      throw new UnauthorizedException();
    await this.pendingGamesService.remove(pendingGameId);
    const game = this.gamesService.createNewGame(
      pending.hostUser.id,
      pending.guestUser.id,
      false,
    );
    this.pendingGamesGateway.server.emit('update');
    return game;
  }

  @Delete(':pendingGameId')
  async remove(
    @Session() session: Record<string, any>,
    @Param('pendingGameId', new ParseIntPipe()) pendingGameId: number,
  ): Promise<void> {
    const userId: number = session.userId;
    const pending = await this.pendingGamesService.findOne(pendingGameId);
    if (!pending) throw new NotFoundException();
    if (pending.hostUser.id != userId && pending.guestUser.id != userId)
      throw new ForbiddenException();
    await this.pendingGamesService.remove(pendingGameId);
    this.pendingGamesGateway.server.emit('update');
  }
}
