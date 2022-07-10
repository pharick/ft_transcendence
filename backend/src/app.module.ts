import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';

import { User } from './users/user.entity';
import { AuthModule } from './auth/auth.module';
import { UsersModule } from './users/users.module';
import { GamesModule } from './games/games.module';
import { PendingGame } from './pendingGames/pendingGame.entity';
import { PendingGamesModule } from './pendingGames/pendingGames.module';
import { CompletedGame } from './completedGames/completedGame.entity';
import { MatchMakingGamesModule } from './matchMakingGames/matchMakingGames.module';
import { ChatModule } from './chat/chat.module';
import { ChatRoom } from './chat/chatRoom.entity';
import { ChatMessage } from './chat/chatMessage.entity';

@Module({
  imports: [
    ConfigModule.forRoot(),
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: process.env.POSTGRES_HOST,
      port: parseInt(process.env.POSTGRES_PORT, 10),
      username: process.env.POSTGRES_USER,
      password: process.env.POSTGRES_PASSWORD,
      database: process.env.POSTGRES_DATABASE,
      entities: [User, PendingGame, CompletedGame, ChatRoom, ChatMessage],
      synchronize: true,
    }),
    TypeOrmModule.forFeature([User]),
    AuthModule,
    UsersModule,
    GamesModule,
    PendingGamesModule,
    MatchMakingGamesModule,
    ChatModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
