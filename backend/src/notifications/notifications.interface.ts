import { Game } from '../games/games.interfaces';
import { PendingGame } from '../pendingGames/pendingGame.entity';
import { ChatRoomInvite } from '../chat/chatRoomInvite.entity';

export interface Notifications {
  games: Game[];
  pending: PendingGame[];
  chatInvites: ChatRoomInvite[];
}
