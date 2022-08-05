import { forwardRef, Module } from '@nestjs/common';
import { GamesService } from './games.service';
import { GamesGateway } from './games.gateway';
import { GamesController } from './games.controller';
import { UsersModule } from '../users/users.module';
import { AuthModule } from '../auth/auth.module';
import { CompletedGamesModule } from '../completedGames/completedGames.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CompletedGame } from '../completedGames/completedGame.entity';
import { NotificationsModule } from '../notifications/notifications.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([CompletedGame]),
    forwardRef(() => NotificationsModule),
    UsersModule,
    AuthModule,
    CompletedGamesModule,
  ],
  providers: [GamesService, GamesGateway],
  controllers: [GamesController],
  exports: [GamesService],
})
export class GamesModule {}
