import { forwardRef, Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PendingGame } from './pendingGame.entity';
import { PendingGamesController } from './pendingGames.controller';
import { PendingGamesService } from './pendingGames.service';
import { GamesModule } from '../games/games.module';
import { UsersModule } from '../users/users.module';
import { NotificationsModule } from '../notifications/notifications.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([PendingGame]),
    forwardRef(() => GamesModule),
    UsersModule,
    NotificationsModule,
  ],
  providers: [PendingGamesService],
  controllers: [PendingGamesController],
})
export class PendingGamesModule {}
