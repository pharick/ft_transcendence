import {
  Controller,
  Get,
  Logger,
  NotFoundException,
  Param,
  Put,
  Req,
  UseGuards,
} from '@nestjs/common';
import { Request } from 'express';
import { GamesService } from './games.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { Game } from './games.interfaces';

@Controller('games')
export class GamesController {
  private logger: Logger = new Logger('GamesController');

  constructor(private gamesService: GamesService) {}

  @Put()
  @UseGuards(JwtAuthGuard)
  async createTraining(@Req() request: Request): Promise<Game> {
    return await this.gamesService.create(false, request.user.id);
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
