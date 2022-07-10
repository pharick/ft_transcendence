import React, {FC, useEffect, useRef, useState} from 'react';
import {io, Socket} from "socket.io-client";
import useEventListener from '../hooks/use_event_listener';
import { FrameInfo, GameInfo } from '../types/interfaces';

interface MatchMakingModalProps {
  onClose: () => void;
}

const MatchMakingModal: FC<MatchMakingModalProps> = ({ onClose }) => {

  const socket = useRef<Socket>();

  const keyDownHandler = (e: KeyboardEvent) => {
    if (e.code == 'Escape') {
      onClose();
    }
  };

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
      console.log(game);
    });
  }, []);

  useEventListener('keydown', keyDownHandler, document);

  return (
    <div className="modal">
      <div className="modal-content">
        <div className="modal-header">
          <h4 className="modal-title">Trying to find an opponent</h4>
        </div>
        <div className="modal-body">
          spinner
        </div>
        <div className="modal-footer">
          <button onClick={onClose} className="error-button">Cancel</button>
        </div>
      </div>
    </div>
  )
}

const MatchMakingModeButton: FC = () => {

  const [isOpen, setIsOpen] = useState(false);

  const createMatchMaking = async () => {
    const response = await fetch('/api/matchMaking', {
      method: 'PUT',
    });
    setIsOpen(true);
  };

  const cancelMatchMaking = async () => {
    const response = await fetch('/api/matchMaking', {
      method: 'DELETE',
    });
    setIsOpen(false);
  };

  return (
    <>
      <button onClick={createMatchMaking}>
        MatchMakingMode
      </button>
      {isOpen && <MatchMakingModal onClose={cancelMatchMaking} />}
    </>
  )
};

export default MatchMakingModeButton;
