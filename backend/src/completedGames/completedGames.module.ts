import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CompletedGame } from './completedGame.entity';
import { CompletedGamesService } from './completedGames.service';
import { CompletedGamesController } from './completedGames.controller';

@Module({
  imports: [TypeOrmModule.forFeature([CompletedGame])],
  providers: [CompletedGamesService],
  controllers: [CompletedGamesController],
  exports: [CompletedGamesService],
})
export class CompletedGamesModule {}
