import { Module } from '@nestjs/common';
import { GamesService } from "./games.service";
import { GamesGateway } from "./games.gateway";
import { GamesController } from "./games.controller";

@Module({
  imports: [],
  providers: [GamesService, GamesGateway],
  controllers: [GamesController],
})
export class GamesModule {}
