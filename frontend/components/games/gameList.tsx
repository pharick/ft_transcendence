import React, { FC, useContext } from 'react';
import { Game } from '../../types/interfaces';
import Link from 'next/link';
import { UserContext } from '../users/userProvider';
import UserBlockSmall from '../users/userBlockSmall';

import styles from '../../styles/GameList.module.css';

interface GameListProps {
  games: Game[];
}

const GameList: FC<GameListProps> = ({ games }) => {
  const userContext = useContext(UserContext);

  return games.length > 0 ? (
    <ul className={styles.gameList}>
      {games.map((game) => (
        <li key={game.id}>
          <Link href={`/games/${game.id}`}>
            <a className={styles.gameCardLink}>
              <article className={styles.gameCard}>
                <div className={styles.scores}>
                  <div className={styles.part}>
                    <UserBlockSmall user={game.player1} />
                    <p className={styles.score}>{game.score1}</p>
                  </div>
                  <div className={styles.part}>
                    <UserBlockSmall user={game.player2} />
                    <p className={styles.score}>{game.score2}</p>
                  </div>
                </div>
                <h3 className={styles.header}>
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
