import React, { FC, useContext } from 'react';
import { Game } from '../../types/interfaces';
import Link from 'next/link';
import { UserContext } from '../users/userProvider';
import Image from 'next/image';

interface GameListProps {
  games: Game[];
}

const GameList: FC<GameListProps> = ({ games }) => {
  const userContext = useContext(UserContext);
  const defaultAvatarUrl = 'static/avatars/default.png';

  return games.length > 0 ? (
    <ul className="game-list">
      {games.map((game) => (
        <li key={game.id}>
          <Link href={`/games/${game.id}`}>
            <a className="game-card-link">
              <article className="game-card">
                <div className="game-card-scores">
                  <div className="avatar-small">
                    <Image
                      src={`${process.env.NEXT_PUBLIC_INTERNAL_API_URL}/${
                        game.player1.avatar || defaultAvatarUrl
                      }`}
                      width={50}
                      height={50}
                      alt={game.player1.username}
                    />
                  </div>
                  <div className="game-card-part">
                    <p className="game-card-score">{game.score1}</p>
                    <p className="game-card-player">{game.player1.username}</p>
                  </div>
                  <div className="game-card-part">
                    <p className="game-card-score">{game.score2}</p>
                    <p className="game-card-player">
                      {game.player2 ? game.player2.username : 'Mr. Wall'}
                    </p>
                  </div>
                  <div className="avatar-small">
                    <Image
                      src={`${process.env.NEXT_PUBLIC_INTERNAL_API_URL}/${
                        game.player2?.avatar || defaultAvatarUrl
                      }`}
                      width={50}
                      height={50}
                      alt={game.player2 ? game.player1.username : 'Mr. Wall'}
                    />
                  </div>
                </div>
                <h3 className="game-card-header">
                  {userContext.user &&
                  (game.player1?.id == userContext.user?.id ||
                    game.player2?.id == userContext.user?.id)
                    ? 'Play'
                    : 'Watch'}
                </h3>
              </article>
            </a>
          </Link>
        </li>
      ))}
    </ul>
  ) : (
    <p>No current games</p>
  );
};

export default GameList;
