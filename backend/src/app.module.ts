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
        entities: [User, CompletedGame, PendingGame],
      }),
    }),
    AuthModule,
    UsersModule,
    GamesModule,
    CompletedGamesModule,
    PendingGamesModule,
    MatchMakingModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
