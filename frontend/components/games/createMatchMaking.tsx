import React, { FC, useCallback, useContext, useState } from 'react';
import Link from 'next/link';
import { io } from 'socket.io-client';
import { GameInfo } from '../../types/interfaces';
import dynamic from 'next/dynamic';
import { UserContext } from '../users/userProvider';

const Modal = dynamic(() => import('../../components/layout/modal'), { ssr: false });

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

  const handleClick = () => {
    createMatchMaking().then();
    setIsOpen(true);
  }

  const createMatchMaking = useCallback(async () => {
    const response = await fetch('/api/matchMaking', {
      method: 'PUT',
    });

    socket.connect();

    socket.on('newMatch', (game: GameInfo) => {
      if (game.player1.id == userContext.user?.id || game.player2.id == userContext.user?.id) {
        setGame(game);
      }
    });
  }, [userContext]);

  const cancelMatchMaking = useCallback(async () => {
    const response = await fetch('/api/matchMaking', {
      method: 'DELETE',
    });
    setIsOpen(false);

    socket.off('newMatch');
    socket.disconnect();
  }, []);

  return (
    <>
      <button onClick={handleClick}>
        MatchMakingMode
      </button>

      <Modal
        isOpen={isOpen}
        cancelButtonText={'Cancel'}
        cancelButtonHandler={cancelMatchMaking}
        isCancelButtonDisabled={Boolean(game)}
        title={game ? 'Opponent founded' : 'Searching for an opponent...'}
      >
        {game ?
          <div className='modal-body-button-play'>
            <p>Game created: <b>{game.player1.username}</b> vs. <b>{game.player2.username}</b></p>
            <p><Link href={`/games/${game.gameId}`}>
              <a className='button'>Play</a>
            </Link></p>
          </div>
          :
          <div className='loader'></div>
        }
      </Modal>
    </>
  );
};

export default MatchMakingButton;
