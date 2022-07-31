import { FC, useContext } from 'react';
import { PendingGame } from '../../types/interfaces';
import { RequestErrorHandlerContext } from '../utils/requestErrorHandlerProvider';
import { fetchWithHandleErrors } from '../../utils';

interface InviteGameBlockProps {
  game: PendingGame;
}

const InviteGameBlock: FC<InviteGameBlockProps> = ({ game }) => {
  const requestErrorHandlerContext = useContext(RequestErrorHandlerContext);

  const handleAccept = async (pendingGameId: number) => {
    await fetchWithHandleErrors(
      requestErrorHandlerContext,
      `/api/pending/${pendingGameId}/accept`,
      true,
      'POST',
    );
  };

  const handleRemove = async (pendingGameId: number) => {
    await fetchWithHandleErrors(
      requestErrorHandlerContext,
      `/api/pending/${pendingGameId}`,
      true,
      'DELETE',
    );
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
