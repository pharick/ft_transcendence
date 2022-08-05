import { FC, useContext } from 'react';
import { PendingGame } from '../../types/interfaces';
import { RequestErrorHandlerContext } from '../utils/requestErrorHandlerProvider';
import { fetchWithHandleErrors } from '../../utils';
import { UserContext } from '../users/userProvider';

interface PendingGameBlockProps {
  game: PendingGame;
}

const PendingGameBlock: FC<PendingGameBlockProps> = ({ game }) => {
  const requestErrorHandlerContext = useContext(RequestErrorHandlerContext);
  const userContext = useContext(UserContext);

  const handleAccept = async (pendingGameId: number) => {
    await fetchWithHandleErrors({
      requestErrorHandlerContext,
      url: `/api/pending/${pendingGameId}/accept`,
      method: 'POST',
    });
  };

  const handleRemove = async (pendingGameId: number) => {
    await fetchWithHandleErrors({
      requestErrorHandlerContext,
      url: `/api/pending/${pendingGameId}`,
      method: 'DELETE',
    });
  };

  if (game.player1.id == userContext.user?.id) {
    return (
      <article className="notification-block">
        <p>
          Waiting for <b>{game.player2.username}</b>
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
  } else {
    return (
      <article className="notification-block">
        <p>
          <b>{game.player1.username}</b> invites you
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
  }
};

export default PendingGameBlock;
