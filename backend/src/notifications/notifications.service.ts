import { forwardRef, Inject, Injectable } from '@nestjs/common';
import { NotificationsGateway } from './notifications.gateway';
import { Notifications } from './notifications.interface';
import { GamesService } from '../games/games.service';
import { PendingGamesService } from '../pendingGames/pendingGames.service';
import { ChatRoomsService } from '../chat/chatRooms.service';

@Injectable()
export class NotificationsService {
  constructor(
    private notificationsGateway: NotificationsGateway,
    @Inject(forwardRef(() => GamesService))
    private gamesService: GamesService,
    @Inject(forwardRef(() => PendingGamesService))
    private pendingGamesService: PendingGamesService,
    private chatRoomsService: ChatRoomsService,
  ) {}

  async send(userId: number) {
    const games = await this.gamesService.findAllByUser(userId);
    const pending = await this.pendingGamesService.findAllByUser(userId);
    const chatInvites = await this.chatRoomsService.findAllInvitesByUser(
      userId,
    );
    const notifications: Notifications = { games, pending, chatInvites };
    this.notificationsGateway.server
      .to(`user-${userId}`)
      .emit('notifications', notifications);
  }
}
