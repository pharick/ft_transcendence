import {FC, useEffect, useRef, useState} from 'react';
import { io, Socket } from "socket.io-client";

import useEventListener from '../hooks/use_event_listener';
import { FrameInfo, GameInfo, User } from '../types/interfaces';

interface PongProps {
  gameInfo: GameInfo;
  user: User | undefined;
}

const Pong: FC<PongProps> = ({ gameInfo, user }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const socket = useRef<Socket>();

  const renderField = ({ ballX, ballY, club1Pos, club2Pos }: FrameInfo) => {
    const canvas = canvasRef.current;
    const ctx = canvasRef.current?.getContext('2d');
    if (!canvas || !ctx) return;

    ctx.clearRect(0, 0, canvas.width, canvas.height);

    ctx.fillStyle = 'rgb(0, 0, 0)';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    ctx.fillStyle = 'rgb(255, 255, 255)';

    ctx.beginPath();
    ctx.arc(ballX, ballY, 10, 0, 2 * Math.PI);
    ctx.fill();

    ctx.fillRect(20, club1Pos - 80, 20, 160);
    ctx.fillRect(canvas.width - 40, club2Pos - 80, 20, 160);
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
    console.log(gameInfo, user);

    let delta = 0;
    if (e.code == 'ArrowUp') delta = -20;
    else if (e.code == 'ArrowDown') delta = 20;

    if (gameInfo.player1?.id == user?.id || gameInfo.player2?.id == user?.id) {
      socket.current?.emit('moveClub', delta);
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
