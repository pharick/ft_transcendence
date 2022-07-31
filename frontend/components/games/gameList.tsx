import { FC, useContext } from 'react';
import { GameInfo, UserInfo } from '../../types/interfaces';
import Link from 'next/link';
import { UserContext } from '../users/userProvider';

interface GameListProps {
  games: GameInfo[];
}

const GameList: FC<GameListProps> = ({ games }) => {

  const userContext = useContext(UserContext);

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
                    {userContext.user && (game.player1?.id == userContext.user?.id || game.player2?.id == userContext.user?.id) ? 'Play' : 'Watch'}
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
