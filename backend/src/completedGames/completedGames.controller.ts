import {
  Controller,
  Get,
  Logger,
  NotFoundException,
  Param,
  ParseIntPipe,
} from '@nestjs/common';

import { CompletedGamesService } from './completedGames.service';
import { CompletedGame } from './completedGame.entity';
import { UsersService } from '../users/users.service';

@Controller('completed')
export class CompletedGamesController {
  private logger: Logger = new Logger('CompletedGamesController');

  constructor(
    private completedGamesService: CompletedGamesService,
    private usersService: UsersService,
  ) {}

  @Get(':id')
  async findOne(
    @Param('id', new ParseIntPipe()) id: number,
  ): Promise<CompletedGame> {
    const completedGame = await this.completedGamesService.findOne(id);
    if (!completedGame) throw new NotFoundException();
    return completedGame;
  }

  @Get('user/:id')
  async findAllByUser(
    @Param('id', new ParseIntPipe()) userId: number,
  ): Promise<CompletedGame[]> {
    const user = await this.usersService.findOne(userId);
    if (!user) throw new NotFoundException();
    return await this.completedGamesService.findAllByUser(userId);
  }
}
