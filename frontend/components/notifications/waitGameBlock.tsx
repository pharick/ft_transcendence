import {FC, useContext} from 'react';
import { PendingGame } from '../../types/interfaces';
import {RequestErrorHandlerContext} from "../utils/requestErrorHandlerProvider";
import {fetchWithHandleErrors} from "../../utils";

interface WaitGameBlockProps {
  game: PendingGame;
}

const WaitGameBlock: FC<WaitGameBlockProps> = ({ game }) => {
  const requestErrorHandlerContext = useContext(RequestErrorHandlerContext);

  const handleRemove = async (pendingGameId: number) => {
    await fetchWithHandleErrors(`/api/pending/${pendingGameId}`, 'DELETE', requestErrorHandlerContext);
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
