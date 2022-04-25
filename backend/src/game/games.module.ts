import { Module } from '@nestjs/common';
import { GamesService } from "./games.service";
import { GamesGateway } from "./games.gateway";
import { GamesController } from "./games.controller";
import { UsersService } from '../users/users.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from '../users/user.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([User]),
  ],
  providers: [GamesService, GamesGateway, UsersService],
  controllers: [GamesController],
})
export class GamesModule {}
