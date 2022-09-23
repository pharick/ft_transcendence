import { forwardRef, Module } from '@nestjs/common';
import { NotificationsGateway } from './notifications.gateway';
import { AuthModule } from '../auth/auth.module';
import { GamesModule } from '../games/games.module';
import { PendingGamesModule } from '../pendingGames/pendingGames.module';
import { NotificationsService } from './notifications.service';
import { ChatModule } from '../chat/chat.module';

@Module({
  imports: [
    AuthModule,
    ChatModule,
    forwardRef(() => GamesModule),
    forwardRef(() => PendingGamesModule),
  ],
  providers: [NotificationsGateway, NotificationsService],
  controllers: [],
  exports: [NotificationsService],
})
export class NotificationsModule {}
