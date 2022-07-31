import React, { FC, useCallback, useEffect, useState } from 'react';
import Link from 'next/link';
import { io } from 'socket.io-client';
import { GameInfo, UserInfo } from '../../types/interfaces';
import dynamic from 'next/dynamic';

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

interface MatchMakingButtonProps {
  user: UserInfo | undefined;
}

const MatchMakingButton: FC<MatchMakingButtonProps> = ({ user }) => {

  const [isOpen, setIsOpen] = useState(false);
  const [game, setGame] = useState<GameInfo | undefined>();

  const createMatchMaking = useCallback(async () => {
    const response = await fetch('/api/matchMaking', {
      method: 'PUT',
    });
  }, []);

  const cancelMatchMaking = useCallback(async () => {
    const response = await fetch('/api/matchMaking', {
      method: 'DELETE',
    });
    setIsOpen(false);
  }, []);

  useEffect(() => {
    socket.connect();

    socket.on('newMatch', (game: GameInfo) => {
      if (game.player1.id == user?.id || game.player2.id == user?.id) {
        setGame(game);
      }
    });

    createMatchMaking().then();

    return () => {
      socket.off('newMatch');
      socket.disconnect();
    };
  }, [createMatchMaking, user]);

  return (
    <>
      <button onClick={() => {
        setIsOpen(true);
      }}>
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
