import { Controller, Post, Get } from '@nestjs/common';

import { PongService } from "./pong.service";

@Controller('games')
export class GameController {
  constructor(private pongService: PongService) {}

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
}
