import { FC } from 'react';
import { PendingGame } from '../types/interfaces';

interface InviteGameBlockProps {
  game: PendingGame;
}

const InviteGameBlock: FC<InviteGameBlockProps> = ({ game }) => {
  const handleAccept = async (pendingGameId: number) => {
    const response = await fetch(`/api/pending/${pendingGameId}/accept`, {
      method: 'POST',
    });
    console.log(response);
  };

  const handleRemove = async (pendingGameId: number) => {
    const response = await fetch(`/api/pending/${pendingGameId}`, {
      method: 'DELETE',
    });
    console.log(response);
  };
  return (
    <article className="notification-block">
      <p>
        <b>{game.hostUser.username}</b> invites you
      </p>
      <div>
        <button
          className="success-button"
          onClick={() => {
            handleAccept(game.id).then();
          }}
        >
          Accept
        </button>
        <button
          className="error-button"
          onClick={() => {
            handleRemove(game.id).then();
          }}
        >
          Decline
        </button>
      </div>
    </article>
  );
};

export default InviteGameBlock;
