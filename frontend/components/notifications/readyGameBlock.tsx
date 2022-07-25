import { FC } from 'react';
import { GameInfo } from '../../types/interfaces';
import Link from 'next/link';

interface ReadyGameBlockProps {
  game: GameInfo;
}

const ReadyGameBlock: FC<ReadyGameBlockProps> = ({ game }) => {
  return (
    <article className="notification-block">
      <p>
        Game <b>{game.player1 ? game.player1.username : 'Mr. Wall'}</b> vs{' '}
        <b>{game.player2 ? game.player2.username : 'Mr. Wall'}</b>
      </p>
      <Link href={`/games/${game.gameId}`}>
        <a className="button">Play</a>
      </Link>
    </article>
  );
};

export default ReadyGameBlock;
