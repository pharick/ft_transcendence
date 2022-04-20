import { Module } from '@nestjs/common';
import { GameController } from "./pong/game.controller";
import { PongGateway } from './pong/pong.gateway';
import { PongService } from "./pong/pong.service";

@Module({
  imports: [],
  controllers: [GameController],
  providers: [PongGateway, PongService],
})
export class AppModule {}
