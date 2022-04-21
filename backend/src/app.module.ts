import { Module } from '@nestjs/common';
import { TypeOrmModule } from "@nestjs/typeorm";

import { User } from "./users/user.entity";
import { AuthModule } from './auth/auth.module';
import { UsersModule } from "./users/users.module";
import { GamesModule } from "./game/games.module";
import { UsersService } from "./users/users.service";

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: 'localhost',
      port: 5432,
      username: 'ft_transcendence',
      password: 'ft_transcendence',
      database: 'ft_transcendence',
      entities: [User],
      synchronize: true,
    }),
    TypeOrmModule.forFeature([User]),
    AuthModule,
    UsersModule,
    GamesModule,
  ],
  controllers: [],
  providers: [UsersService],
})
export class AppModule {}
