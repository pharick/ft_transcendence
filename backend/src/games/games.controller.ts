import {
  Controller,
  Get,
  NotFoundException,
  Param,
  Put,
  Req,
  UseGuards,
} from '@nestjs/common';
import { Request } from 'express';
import { GamesService } from './games.service';
import { TwoFactorJwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { Game } from './games.interfaces';

@Controller('games')
export class GamesController {
  constructor(private gamesService: GamesService) {}

  @Put()
  @UseGuards(TwoFactorJwtAuthGuard)
  async createTraining(@Req() request: Request): Promise<Game> {
    return await this.gamesService.create(false, request.user.id, null, 2);
  }

  @Get()
  findAll(): Promise<Game[]> {
    return this.gamesService.findAll();
  }

  @Get(':id')
  async findOne(@Param('id') id: string): Promise<Game> {
    const game: Game = await this.gamesService.findOne(id);
    if (!game) throw new NotFoundException();
    return game;
  }
}
