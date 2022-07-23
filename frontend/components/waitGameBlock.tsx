import { FC } from 'react';
import { PendingGame } from '../types/interfaces';

interface WaitGameBlockProps {
  game: PendingGame;
}

const WaitGameBlock: FC<WaitGameBlockProps> = ({ game }) => {
  const handleRemove = async (pendingGameId: number) => {
    const response = await fetch(`/api/pending/${pendingGameId}`, {
      method: 'DELETE',
    });
    console.log(response);
  };

  return (
    <article className="notification-block">
      <p>
        Waiting for <b>{game.guestUser.username}</b>
      </p>
      <button
        className="error-button"
        onClick={() => {
          handleRemove(game.id).then();
        }}
      >
        Cancel
      </button>
    </article>
  );
};

export default WaitGameBlock;
