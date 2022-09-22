import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthModule } from './auth/auth.module';
import { UsersModule } from './users/users.module';
import { GamesModule } from './games/games.module';
import { CompletedGamesModule } from './completedGames/completedGames.module';
import { User } from './users/user.entity';
import { CompletedGame } from './completedGames/completedGame.entity';
import { PendingGamesModule } from './pendingGames/pendingGames.module';
import { PendingGame } from './pendingGames/pendingGame.entity';
import { MatchMakingModule } from './matchMaking/matchMaking.module';
import { ServeStaticModule } from '@nestjs/serve-static';
import { join } from 'path';
import { UserStatusModule } from './userStatus/userStatus.module';
import { ChatModule } from './chat/chat.module';
import { ChatRoom } from './chat/chatRoom.entity';
import { ChatRoomUser } from './chat/chatRoomUser.entity';
import { ChatMessage } from './chat/chatMessage.entity';
import { ChatRoomInvite } from './chat/chatRoomInvite';

@Module({
  imports: [
    ConfigModule.forRoot(),
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: async (configService: ConfigService) => ({
        type: 'postgres',
        host: configService.get('POSTGRES_HOST'),
        port: parseInt(configService.get('POSTGRES_PORT'), 10),
        username: configService.get('POSTGRES_USER'),
        password: configService.get('POSTGRES_PASSWORD'),
        database: configService.get('POSTGRES_DATABASE'),
        synchronize: true,
        entities: [
          User,
          CompletedGame,
          PendingGame,
          ChatRoom,
          ChatRoomUser,
          ChatMessage,
          ChatRoomInvite,
        ],
      }),
    }),
    ServeStaticModule.forRoot({
      rootPath: join(__dirname, '..', 'static'),
      serveRoot: '/static',
    }),
    AuthModule,
    UsersModule,
    GamesModule,
    UserStatusModule,
    CompletedGamesModule,
    PendingGamesModule,
    MatchMakingModule,
    ChatModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
