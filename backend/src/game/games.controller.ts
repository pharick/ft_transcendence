import {Controller, Post, Get, Param, Logger} from '@nestjs/common';

import { GamesService } from "./games.service";

@Controller('games')
export class GamesController {
  constructor(private pongService: GamesService) {}

  private logger: Logger = new Logger('GamesController');

  @Get()
  findAll(): string[] {
    return this.pongService.findAll();
  }

  @Post()
  create() {
    return {
      game_id: this.pongService.createNewGame(),
    }
  }

  @Post(':game_id/toggle')
  toggleGameRunning(@Param() params) {
    this.logger.log(`Toggle game running: ${params.game_id}`);
    this.pongService.toggleGameRunning(params.game_id);
  }
}
