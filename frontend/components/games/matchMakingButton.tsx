import React, { FC, useContext, useState } from 'react';
import { io, Socket } from 'socket.io-client';
import { Game } from '../../types/interfaces';
import dynamic from 'next/dynamic';
import { RequestErrorHandlerContext } from '../utils/requestErrorHandlerProvider';
import { fetchWithHandleErrors } from '../../utils';
import Image from 'next/image';
import gameImage from '../../images/ranked_game.svg';
import ReadyGameBlock from '../notifications/readyGameBlock';

const Modal = dynamic(() => import('../../components/layout/modal'), {
  ssr: false,
});

const MatchMakingButton: FC = () => {
  const [socket, setSocket] = useState<Socket>();
  const [isOpen, setIsOpen] = useState(false);
  const [game, setGame] = useState<Game | undefined>();
  const requestErrorHandlerContext = useContext(RequestErrorHandlerContext);

  const createMatchMaking = async () => {
    const response = await fetchWithHandleErrors({
      requestErrorHandlerContext,
      url: '/api/matchmaking',
      method: 'PUT',
      authRequired: true,
    });
    if (!response.ok) return;

    const socket = io(
      `${
        process.env.NODE_ENV == 'development'
          ? process.env.NEXT_PUBLIC_INTERNAL_API_URL
          : ''
      }/matchmaking`,
      {
        auth: { token: localStorage.getItem('token') },
      },
    );

    socket.on('newMatch', (game: Game) => {
      setGame(game);
    });

    setSocket(socket);
    setIsOpen(true);
  };

  const cancelMatchMaking = async () => {
    await fetchWithHandleErrors({
      requestErrorHandlerContext,
      url: '/api/matchmaking',
      method: 'DELETE',
    });

    setIsOpen(false);

    socket.off('newMatch');
    socket.disconnect();
  };

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
