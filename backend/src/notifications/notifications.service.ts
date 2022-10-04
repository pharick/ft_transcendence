import { forwardRef, Inject, Injectable } from '@nestjs/common';
import { NotificationsGateway } from './notifications.gateway';
import { Notifications } from './notifications.interface';
import { GamesService } from '../games/games.service';
import { PendingGamesService } from '../pendingGames/pendingGames.service';
import { ChatRoomsService } from '../chat/chatRooms.service';
import { InviteFriendsService } from 'src/friends/inviteFriends.service';

@Injectable()
export class NotificationsService {
  constructor(
    private notificationsGateway: NotificationsGateway,
    @Inject(forwardRef(() => GamesService))
    private gamesService: GamesService,
    @Inject(forwardRef(() => PendingGamesService))
    private pendingGamesService: PendingGamesService,
    private chatRoomsService: ChatRoomsService,
    @Inject(forwardRef(() => InviteFriendsService))
    private inviteFriendsService: InviteFriendsService,
  ) {}

  async send(userId: number) {
    const games = await this.gamesService.findAllByUser(userId);
    const pending = await this.pendingGamesService.findAllByUser(userId);
    const chatInvites = await this.chatRoomsService.findAllInvitesByUser(
      userId,
    );
    const friendsInvites = await this.inviteFriendsService.findAllByUser(
      userId,
    );
    const notifications: Notifications = {
      games,
      pending,
      chatInvites,
      friendsInvites,
    };
    this.notificationsGateway.server
      .to(`user-${userId}`)
      .emit('notifications', notifications);
  }
}
