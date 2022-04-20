import {Controller, Post, Get, Param, Logger} from '@nestjs/common';

import { PongService } from "./pong.service";

@Controller('games')
export class GameController {
  constructor(private pongService: PongService) {}

  private logger: Logger = new Logger('GameController');

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
