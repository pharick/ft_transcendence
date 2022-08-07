import { FC } from 'react';
import { Game } from '../../types/interfaces';
import Link from 'next/link';

import styles from '../../styles/Notifications.module.css';

interface ReadyGameBlockProps {
  game: Game;
}

const ReadyGameBlock: FC<ReadyGameBlockProps> = ({ game }) => {
  return (
    <article className={styles.block}>
      <p>
        Game <b>{game.player1.username}</b> vs{' '}
        <b>{game.player2 ? game.player2.username : 'Mr. Wall'}</b>
      </p>
      <Link href={`/games/${game.id}`}>
        <a className="button">Play</a>
      </Link>
    </article>
  );
};

export default ReadyGameBlock;
