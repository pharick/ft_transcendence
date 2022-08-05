import { Game } from '../games/games.interfaces';
import { PendingGame } from '../pendingGames/pendingGame.entity';

export interface Notifications {
  games: Game[];
  pending: PendingGame[];
}
