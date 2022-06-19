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

@Controller('completed')
export class CompletedGamesController {
  private logger: Logger = new Logger('CompletedGamesController');

  constructor(private completedGamesService: CompletedGamesService) {}

  @Get(':completedGameId')
  async findOne(
    @Param('completedGameId', new ParseIntPipe()) completedGameId: number,
  ): Promise<CompletedGame> {
    const completedGame = await this.completedGamesService.findOne(
      completedGameId,
    );
    if (!completedGame) throw new NotFoundException();
    return completedGame;
  }

  @Get('user/:userId')
  async findAllByUser(
    @Param('userId', new ParseIntPipe()) userId: number,
  ): Promise<CompletedGame[]> {
    const completedGames = await this.completedGamesService.findAllByUser(
      userId,
    );
    return completedGames;
  }
}
