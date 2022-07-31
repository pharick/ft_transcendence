import { Module } from '@nestjs/common';
import { MatchMakingController } from './matchMaking.controller';
import { MatchMakingService } from './matchMaking.service';
import { GamesModule } from '../games/games.module';
import { UsersModule } from '../users/users.module';
import { MatchMakingGateway } from './matchMaking.gateway';

@Module({
  imports: [GamesModule, UsersModule],
  providers: [MatchMakingService, MatchMakingGateway],
  controllers: [MatchMakingController],
})
export class MatchMakingModule {}
