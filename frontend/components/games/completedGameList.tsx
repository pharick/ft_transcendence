import { FC } from 'react';
import { CompletedGameInfo } from '../../types/interfaces';
import Link from 'next/link';
import { format } from 'date-fns';
import { utcToZonedTime } from 'date-fns-tz';

interface CompletedGameListProps {
  games: CompletedGameInfo[];
}

const CompletedGameList: FC<CompletedGameListProps> = ({ games }) => {
  return (
    games.length > 0 ?
      <ul className='completed-game-list'>
        {games.map((game) => (
          <li key={game.id}>
            <Link href={`/completed/${game.id}`}>
              <a className='completed-game-link'>
                <article className='completed-game-card'>
                  <div className='completed-game-card-part'>
                    {format(utcToZonedTime(game.date, 'Europe/Moscow'), 'dd.MM.yyyy H:mm:ss')}
                  </div>

                  <div className='completed-game-card-part'>
                    <p className='completed-game-card-user'>
                      {game.hostUser.username}
                    </p>
                    <p className='completed-game-card-scores'>
                      {game.score1} — {game.score2}
                    </p>
                    <p className='completed-game-card-user'>
                      {game.guestUser.username}
                    </p>
                  </div>

                  <div className='completed-game-card-part'>
                    {game.duration}s
                  </div>
                </article>
              </a>
            </Link>
          </li>
        ))}
      </ul>
      : <p>No completed games</p>
  );
};

export default CompletedGameList;
