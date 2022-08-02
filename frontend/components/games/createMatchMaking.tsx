import React, { FC, useCallback, useContext, useState } from 'react';
import Link from 'next/link';
import { io } from 'socket.io-client';
import { GameInfo } from '../../types/interfaces';
import dynamic from 'next/dynamic';
import { UserContext } from '../users/userProvider';
import { RequestErrorHandlerContext } from '../utils/requestErrorHandlerProvider';
import { fetchWithHandleErrors } from '../../utils';

const Modal = dynamic(() => import('../../components/layout/modal'), {
  ssr: false,
});

const socket = io(
  `${
    process.env.NODE_ENV == 'development'
      ? process.env.NEXT_PUBLIC_INTERNAL_API_URL
      : ''
  }/matchmaking`,
  {
    autoConnect: false,
  },
);

const MatchMakingButton: FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [game, setGame] = useState<GameInfo | undefined>();
  const userContext = useContext(UserContext);
  const requestErrorHandlerContext = useContext(RequestErrorHandlerContext);

  const handleClick = () => {
    createMatchMaking().then();
    setIsOpen(true);
  };

  const createMatchMaking = useCallback(async () => {
    await fetchWithHandleErrors({
      requestErrorHandlerContext,
      url: '/api/matchMaking',
      token: '',
      method: 'PUT',
    });

    socket.connect();

    socket.on('newMatch', (game: GameInfo) => {
      if (
        game.player1.id == userContext.user?.id ||
        game.player2.id == userContext.user?.id
      ) {
        setGame(game);
      }
    });
  }, [requestErrorHandlerContext, userContext.user?.id]);

  const cancelMatchMaking = useCallback(async () => {
    await fetchWithHandleErrors({
      requestErrorHandlerContext,
      url: '/api/matchMaking',
      token: '',
      method: 'DELETE',
    });

    setIsOpen(false);

    socket.off('newMatch');
    socket.disconnect();
  }, [requestErrorHandlerContext]);

  return (
    <>
      <button onClick={handleClick}>MatchMakingMode</button>

      <Modal
        isOpen={isOpen}
        cancelButtonText={'Cancel'}
        cancelButtonHandler={cancelMatchMaking}
        isCancelButtonDisabled={Boolean(game)}
        title={game ? 'Opponent founded' : 'Searching for an opponent...'}
      >
        {game ? (
          <div className="modal-body-button-play">
            <p>
              Game created: <b>{game.player1.username}</b> vs.{' '}
              <b>{game.player2.username}</b>
            </p>
            <p>
              <Link href={`/games/${game.gameId}`}>
                <a className="button">Play</a>
              </Link>
            </p>
          </div>
        ) : (
          <div className="loader" />
        )}
      </Modal>
    </>
  );
};

export default MatchMakingButton;
