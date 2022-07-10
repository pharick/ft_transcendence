import { Module } from '@nestjs/common';
import { MatchMakingGamesController } from './matchMakingGames.controller';
import { MatchMakingGamesService } from './matchMakingGames.service';
import { GamesModule } from '../games/games.module';
import { UsersModule } from '../users/users.module';
import { MatchMakingGamesGateway } from './matchMakingGames.gateway';

@Module({
  imports: [GamesModule, UsersModule],
  providers: [MatchMakingGamesService, MatchMakingGamesGateway],
  controllers: [MatchMakingGamesController],
})
export class MatchMakingGamesModule {}
