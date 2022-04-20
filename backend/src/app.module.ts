import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { ChatGateway } from './chat/chat.gateway';
import { PongGateway } from './pong/pong.gateway';
import { PongService } from "./pong/pong.service";
import { GameController } from "./pong/game.controller";

@Module({
  imports: [],
  controllers: [AppController, GameController],
  providers: [PongGateway, PongService],
})
export class AppModule {}
