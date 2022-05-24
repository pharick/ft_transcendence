import { Module } from '@nestjs/common';
import { GamesService } from './games.service';
import { GamesGateway } from './games.gateway';
import { GamesController } from './games.controller';
import { UsersService } from '../users/users.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from '../users/user.entity';
import { HttpModule } from '@nestjs/axios';
import { AuthModule } from '../auth/auth.module';

@Module({
  imports: [TypeOrmModule.forFeature([User]), HttpModule, AuthModule],
  providers: [GamesService, GamesGateway, UsersService],
  controllers: [GamesController],
  exports: [GamesService],
})
export class GamesModule {}
