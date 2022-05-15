import {FC, useEffect, useRef, useState} from 'react';
import { io, Socket } from "socket.io-client";

import useEventListener from '../hooks/use_event_listener';
import { FrameInfo, GameInfo, User } from '../types/interfaces';

interface PongProps {
  gameInfo: GameInfo;
  user: User | undefined;
  userSessionId: string | undefined;
}

const Pong: FC<PongProps> = ({ gameInfo, user, userSessionId }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const socket = useRef<Socket>();

  const renderField = ({ ballRadius, ballX, ballY, clubWidth, club1Pos, club2Pos }: FrameInfo) => {
    const canvas = canvasRef.current;
    const ctx = canvasRef.current?.getContext('2d');
    if (!canvas || !ctx) return;

    ctx.clearRect(0, 0, canvas.width, canvas.height);

    ctx.fillStyle = 'rgb(0, 0, 0)';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    ctx.fillStyle = 'rgb(255, 255, 255)';

    ctx.beginPath();
    ctx.arc(ballX, ballY, ballRadius, 0, 2 * Math.PI);
    ctx.fill();

    ctx.fillRect(20, club1Pos - 80, clubWidth, 160);
    ctx.fillRect(canvas.width - clubWidth - 20, club2Pos - 80, clubWidth, 160);
  };

  const toggleGameRunning = async () => {
    const response = await fetch(`/api/games/${gameInfo.gameId}/toggle`, { method: 'POST' });
  };

  useEffect(() => {
    if (socket.current)
      return;

    socket.current = io('http://localhost:4000');
    socket.current?.emit('connectToGame', gameInfo.gameId);

    socket.current?.on('nextFrame', (frame: FrameInfo) => {
      renderField(frame);
    });
  }, []);

  const keyHandler = (e: KeyboardEvent) => {
    let delta = 0;
    if (e.code == 'ArrowUp') delta = -10;
    else if (e.code == 'ArrowDown') delta = 10;

    if (delta != 0 &&
        (gameInfo.player1?.id == user?.id ||
         gameInfo.player2?.id == user?.id)) {
      const gameId = gameInfo.gameId;
      socket.current?.emit('moveClub', { gameId, userSessionId, delta });
    }
  };

  useEventListener('keydown', keyHandler, document);

  return (
    <>
      <canvas width={800} height={600} ref={canvasRef}></canvas>
      <button onClick={toggleGameRunning}>Run / Pause</button>
    </>
  );
};

export default Pong;
