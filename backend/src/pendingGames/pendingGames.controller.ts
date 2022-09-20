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
import { TwoFactorJwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { CreatePendingGameDto } from './pendingGames.dto';
import { Game } from '../games/games.interfaces';
import { GamesService } from '../games/games.service';
import { UsersService } from '../users/users.service';

@Controller('pending')
export class PendingGamesController {
  private logger: Logger = new Logger('PendingGamesController');

  constructor(
    private pendingGamesService: PendingGamesService,
    private gamesService: GamesService,
    private usersService: UsersService,
  ) {}

  @UseGuards(TwoFactorJwtAuthGuard)
  @Put()
  async create(
    @Req() request: Request,
    @Body() { player2Id, mode }: CreatePendingGameDto,
  ): Promise<PendingGame> {
    return this.pendingGamesService
      .create(request.user.id, player2Id, mode)
      .catch((error) => {
        this.logger.error(error);
        throw new ConflictException();
      });
  }

  @Get()
  findAll(): Promise<PendingGame[]> {
    return this.pendingGamesService.findAll();
  }

  @Get('user/:id')
  async findAllByUser(
    @Param('id', new ParseIntPipe()) userId: number,
  ): Promise<PendingGame[]> {
    const user = await this.usersService.findOne(userId);
    if (!user) throw new NotFoundException();
    return this.pendingGamesService.findAllByUser(userId);
  }

  @UseGuards(TwoFactorJwtAuthGuard)
  @Post(':id/accept')
  async accept(
    @Req() request: Request,
    @Param('id', new ParseIntPipe()) pendingId: number,
  ): Promise<Game> {
    const pending: PendingGame = await this.pendingGamesService.findOne(
      pendingId,
    );
    if (!pending) throw new NotFoundException();
    if (request.user.id != pending.player2.id)
      throw new UnauthorizedException();
    await this.pendingGamesService.remove(pendingId);
    return this.gamesService.create(
      false,
      pending.player1.id,
      pending.player2.id,
      pending.mode,
    );
  }

  @UseGuards(TwoFactorJwtAuthGuard)
  @Delete(':id')
  async remove(
    @Req() request: Request,
    @Param('id', new ParseIntPipe()) pendingId: number,
  ) {
    const pending = await this.pendingGamesService.findOne(pendingId);
    if (!pending) throw new NotFoundException();
    if (
      pending.player1.id != request.user.id &&
      pending.player2.id != request.user.id
    )
      throw new ForbiddenException();
    await this.pendingGamesService.remove(pendingId);
  }
}
