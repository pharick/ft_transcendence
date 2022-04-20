import {FC, useEffect, useRef, useState} from 'react';
import { io, Socket } from "socket.io-client";

import useEventListener from '../hooks/use_event_listener';
import useInterval from '../hooks/use_interval';
import { FrameInfo } from "../types/interfaces";

interface PongProps {
  game_id: string;
}

const Pong: FC<PongProps> = ({ game_id }) => {
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
    const response = await fetch(`http://localhost:3000/games/${game_id}/toggle`, { method: 'POST' });
  };

  useEffect(() => {
    if (socket.current)
      return;

    socket.current = io('ws://localhost:3000');
    socket.current?.emit('connectToGame', game_id);

    socket.current?.on('nextFrame', (frame: FrameInfo) => {
      renderField(frame);
    });
  }, []);

  // const keyHandler = (e: KeyboardEvent) => {
  //   if (e.code == 'ArrowUp') {
  //     socket.current?.emit('moveClub1', -20);
  //   } else if (e.code == 'ArrowDown') {
  //     socket.current?.emit('moveClub1', 20);
  //   }
  // };

  // useEventListener('keydown', keyHandler, document);

  useInterval(() => {
    socket.current?.emit('getNextFrame', game_id);
  }, 10);

  return (
    <>
      <canvas width={800} height={600} ref={canvasRef}></canvas>
      <button onClick={toggleGameRunning}>Run / Pause</button>
    </>
  );
};

export default Pong;
