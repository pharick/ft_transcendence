import React, { FC, useCallback, useContext, useState } from 'react';
import { io } from 'socket.io-client';
import { Game } from '../../types/interfaces';
import dynamic from 'next/dynamic';
import { UserContext } from '../users/userProvider';
import { RequestErrorHandlerContext } from '../utils/requestErrorHandlerProvider';
import { fetchWithHandleErrors } from '../../utils';
import Image from 'next/image';
import gameImage from '../../images/ranked_game.svg';
import ReadyGameBlock from '../notifications/readyGameBlock';

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
  const [game, setGame] = useState<Game | undefined>();
  const userContext = useContext(UserContext);
  const requestErrorHandlerContext = useContext(RequestErrorHandlerContext);

  const createMatchMaking = useCallback(async () => {
    const response = await fetchWithHandleErrors({
      requestErrorHandlerContext,
      url: '/api/matchmaking',
      method: 'PUT',
      authRequired: true,
    });
    if (!response.ok) return;
    socket.auth = { token: localStorage.getItem('token') };
    socket.connect();
    socket.on('newMatch', (game: Game) => {
      setGame(game);
    });
    setIsOpen(true);
  }, [requestErrorHandlerContext, userContext.user]);

  const cancelMatchMaking = useCallback(async () => {
    await fetchWithHandleErrors({
      requestErrorHandlerContext,
      url: '/api/matchmaking',
      method: 'DELETE',
    });

    setIsOpen(false);

    socket.off('newMatch');
    socket.disconnect();
  }, [requestErrorHandlerContext]);

  return (
    <>
      <button className="image-button" onClick={createMatchMaking}>
        <Image src={gameImage} width={100} height={100} />
        <span>Play ranked game</span>
      </button>

      <Modal
        isOpen={isOpen}
        cancelButtonText={'Cancel'}
        cancelButtonHandler={cancelMatchMaking}
        isCancelButtonDisabled={Boolean(game)}
        title={game ? 'Opponent founded' : 'Searching for an opponent...'}
      >
        {game ? <ReadyGameBlock game={game} /> : <div className="loader" />}
      </Modal>
    </>
  );
};

export default MatchMakingButton;
