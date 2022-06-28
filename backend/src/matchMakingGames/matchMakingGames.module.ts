import { Module } from '@nestjs/common';
import { MatchMakingGamesController } from './matchMakingGames.controller';
import { MatchMakingGamesService } from './matchMakingGames.service';

@Module({
  imports: [],
  providers: [MatchMakingGamesService],
  controllers: [MatchMakingGamesController],
})
export class MatchMakingGamesModule {}
