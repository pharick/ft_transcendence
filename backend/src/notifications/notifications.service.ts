import { forwardRef, Inject, Injectable, Logger } from '@nestjs/common';
import { NotificationsGateway } from './notifications.gateway';
import { Notifications } from './notifications.interface';
import { GamesService } from '../games/games.service';
import { PendingGamesService } from '../pendingGames/pendingGames.service';

@Injectable()
export class NotificationsService {
  private logger: Logger = new Logger('NotificationsService');

  constructor(
    private notificationsGateway: NotificationsGateway,
    @Inject(forwardRef(() => GamesService))
    private gamesService: GamesService,
    @Inject(forwardRef(() => PendingGamesService))
    private pendingGamesService: PendingGamesService,
  ) {}

  async send(userId: number) {
    const games = await this.gamesService.findAllByUser(userId);
    const pending = await this.pendingGamesService.findAllByUser(userId);

    const notifications: Notifications = { games, pending };
    this.notificationsGateway.server
      .to(`user-${userId}`)
      .emit('notifications', notifications);
  }
}
