import { FC } from 'react';
import { GameInfo, UserInfo } from '../../types/interfaces';
import Link from 'next/link';

interface GameListProps {
  games: GameInfo[];
  user: UserInfo | undefined;
}

const GameList: FC<GameListProps> = ({ games, user }) => {
  return (
    games.length > 0 ?
      <ul className='game-list'>
        {games.map((game) => (
          <li key={game.gameId}>
            <Link href={`/games/${game.gameId}`}>
              <a className='game-card-link'>
                <article className='game-card'>
                  <div className='game-card-scores'>
                    <div className='game-card-part'>
                      <p className='game-card-score'>{game.scores.player1}</p>
                      <p className='game-card-player'>{game.player1 ? game.player1.username : 'Mr. Wall'}</p>
                    </div>
                    <div className='game-card-part'>
                      <p className='game-card-score'>{game.scores.player2}</p>
                      <p className='game-card-player'>{game.player2 ? game.player2.username : 'Mr. Wall'}</p>
                    </div>
                  </div>
                  <h2 className='game-card-header'>
                    {user && (game.player1?.id == user?.id || game.player2?.id == user?.id) ? 'Play' : 'Watch'}
                  </h2>
                </article>
              </a>
            </Link>
          </li>
        ))}
      </ul>
      : <p>No current games</p>
  );
};

export default GameList;
