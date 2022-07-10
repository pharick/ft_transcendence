import React, {FC, useCallback, useEffect, useRef, useState} from 'react';
import {io, Socket} from "socket.io-client";
import useEventListener from '../hooks/use_event_listener';
import {GameInfo, UserInfo} from '../types/interfaces';
import Link from "next/link";

interface MatchMakingModalProps {
  user: UserInfo | undefined;
  onClose: () => void;
}

const MatchMakingModal: FC<MatchMakingModalProps> = ({user, onClose}) => {

  const socket = useRef<Socket>();
  const [game, setGame] = useState<GameInfo | undefined>();

  const keyDownHandler = (e: KeyboardEvent) => {
    if (e.code == 'Escape') {
      onClose();
    }
  };

  const createMatchMaking = useCallback(async () => {
    const response = await fetch('/api/matchMaking', {
      method: 'PUT',
    });
  }, []);

  const cancelMatchMaking = useCallback(async () => {
    const response = await fetch('/api/matchMaking', {
      method: 'DELETE',
    });
    onClose();
  }, []);

  useEffect(() => {
    if (socket.current && socket.current?.active) return;
    socket.current = io(
      `${
        process.env.NODE_ENV == 'development'
          ? process.env.NEXT_PUBLIC_INTERNAL_API_URL
          : ''
      }/matchmaking`,
    );
    socket.current?.connect();

    socket.current?.on('newMatch', (game: GameInfo) => {
      if (game.player1.id == user?.id || game.player2.id == user?.id) {
        setGame(game);
      }
    });

    createMatchMaking().then();
  }, [createMatchMaking]);

  useEventListener('keydown', keyDownHandler, document);

  return (
    <div className="modal">
      <div className="modal-content">
        <div className="modal-header">
          <h4 className="modal-title">
            {game
              ? 'Opponent founded'
              : 'Searching for an opponent...'
            }
          </h4>
        </div>
        <div className="modal-body">
          {game
            ? <div className="modal-body-button-play">
              <p>Game created: <b>{game.player1.username}</b> vs. <b>{game.player2.username}</b></p>
               <p><Link href={`/games/${game.gameId}`}>
                <a className="button">Play</a>
               </Link></p>
            </div>
            : <p>spinner</p>
          }
        </div>
        <div className="modal-footer">
          <button onClick={cancelMatchMaking} className="error-button" disabled={!!game}>Cancel</button>
        </div>
      </div>
    </div>
  )
}

interface MatchMakingModeButtonProps {
  user: UserInfo | undefined;
}

const MatchMakingModeButton: FC<MatchMakingModeButtonProps> = ({user}) => {

  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      <button onClick={() => {
        setIsOpen(true)
      }}>
        MatchMakingMode
      </button>
      {isOpen && <MatchMakingModal user={user} onClose={() => {
        setIsOpen(false)
      }}/>}
    </>
  )
};

export default MatchMakingModeButton;
