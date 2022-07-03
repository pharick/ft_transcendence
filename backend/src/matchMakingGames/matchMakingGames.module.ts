import { Module } from '@nestjs/common';
import { MatchMakingGamesController } from './matchMakingGames.controller';
import { MatchMakingGamesService } from './matchMakingGames.service';
import { GamesModule } from '../game/games.module';
import { UsersModule } from '../users/users.module';

@Module({
  imports: [GamesModule, UsersModule],
  providers: [MatchMakingGamesService],
  controllers: [MatchMakingGamesController],
})
export class MatchMakingGamesModule {}
