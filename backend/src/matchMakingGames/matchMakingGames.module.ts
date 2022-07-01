import { Module } from '@nestjs/common';
import { MatchMakingGamesController } from './matchMakingGames.controller';
import { MatchMakingGamesService } from './matchMakingGames.service';
import { GamesModule } from '../game/games.module';

@Module({
  imports: [GamesModule],
  providers: [MatchMakingGamesService],
  controllers: [MatchMakingGamesController],
})
export class MatchMakingGamesModule {}
