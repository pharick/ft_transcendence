import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PendingGame } from './pendingGame.entity';
import { User } from '../users/user.entity';
import { PendingGamesController } from './pendingGames.controller';
import { PendingGamesService } from './pendingGames.service';
import { UsersService } from '../users/users.service';

@Module({
  imports: [TypeOrmModule.forFeature([PendingGame, User])],
  providers: [PendingGamesService, UsersService],
  controllers: [PendingGamesController],
})
export class PendingGamesModule {}
