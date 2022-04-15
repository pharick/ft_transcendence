import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { ChatGateway } from './chat/chat.gateway';
import { PongGateway } from './pong/pong.gateway';
import { PongService } from "./pong/pong.service";

@Module({
  imports: [],
  controllers: [AppController],
  providers: [ChatGateway, PongGateway, PongService],
})
export class AppModule {}
