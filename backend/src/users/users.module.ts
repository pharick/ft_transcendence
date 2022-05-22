import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { User } from './user.entity';
import { UsersService } from './users.service';
import { UsersController } from './users.controller';
import { PendingGame } from '../pendingGames/pendingGame.entity';

@Module({
  imports: [TypeOrmModule.forFeature([User, PendingGame])],
  providers: [UsersService],
  controllers: [UsersController],
})
export class UsersModule {}
