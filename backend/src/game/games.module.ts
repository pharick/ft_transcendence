import { Module } from '@nestjs/common';
import { GamesService } from './games.service';
import { GamesGateway } from './games.gateway';
import { GamesController } from './games.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from '../users/user.entity';
import { HttpModule } from '@nestjs/axios';
import { AuthModule } from '../auth/auth.module';
import { UsersModule } from '../users/users.module';
import { CompletedGamesModule } from '../completedGames/completedGames.module';
import { PendingGamesModule } from '../pendingGames/pendingGames.module';
import { PendingGamesGateway } from '../pendingGames/pendingGames.gateway';

@Module({
  imports: [
    TypeOrmModule.forFeature([User]),
    HttpModule,
    AuthModule,
    UsersModule,
    CompletedGamesModule,
    PendingGamesModule,
  ],
  providers: [GamesService, GamesGateway, PendingGamesGateway],
  controllers: [GamesController],
  exports: [GamesService],
})
export class GamesModule {}
