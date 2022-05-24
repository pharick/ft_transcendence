import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PendingGame } from './pendingGame.entity';
import { User } from '../users/user.entity';
import { PendingGamesController } from './pendingGames.controller';
import { PendingGamesService } from './pendingGames.service';
import { UsersService } from '../users/users.service';
import { GamesModule } from '../game/games.module';

@Module({
  imports: [TypeOrmModule.forFeature([PendingGame, User]), GamesModule],
  providers: [PendingGamesService, UsersService],
  controllers: [PendingGamesController],
})
export class PendingGamesModule {}
