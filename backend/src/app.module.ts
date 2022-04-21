import { Module } from '@nestjs/common';
import { TypeOrmModule } from "@nestjs/typeorm";

import { User } from "./users/user.entity";
import { UsersModule } from "./users/users.module";
import { GamesModule } from "./game/games.module";

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
    UsersModule,
    GamesModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
