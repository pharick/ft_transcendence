import { Module } from '@nestjs/common';
import { CompletedGamesService } from './completedGames.service';
import { CompletedGamesController } from './completedGames.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CompletedGame } from './completedGame.entity';
import { UsersModule } from '../users/users.module';

@Module({
  imports: [TypeOrmModule.forFeature([CompletedGame]), UsersModule],
  providers: [CompletedGamesService],
  controllers: [CompletedGamesController],
  exports: [CompletedGamesService],
})
export class CompletedGamesModule {}
