import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PendingGame } from './pendingGame.entity';
import { User } from '../users/user.entity';
import { PendingGamesController } from './pendingGames.controller';
import { PendingGamesService } from './pendingGames.service';
import { GamesModule } from '../game/games.module';
import { UsersModule } from '../users/users.module';
import { PendingGamesGateway } from './pendingGames.gateway';

@Module({
  imports: [
    TypeOrmModule.forFeature([PendingGame, User]),
    GamesModule,
    UsersModule,
  ],
  providers: [PendingGamesService, PendingGamesGateway],
  controllers: [PendingGamesController],
})
export class PendingGamesModule {}
