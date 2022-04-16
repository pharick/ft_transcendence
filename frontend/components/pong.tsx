import {FC, useEffect, useRef, useState} from 'react';
import { io, Socket } from "socket.io-client";

import useEventListener from '../hooks/use_event_listener';
import useInterval from '../hooks/use_interval';

interface FrameInfo {
  ballX: number;
  ballY: number;
  ballRadius: number;
  club1Pos: number;
  club2Pos: number;
}

const Pong: FC = () => {
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

  useEffect(() => {
    if (socket.current)
      return;
    socket.current = io('ws://localhost:3000');
    socket.current?.on('frameInfo', (frameInfo: FrameInfo) => {
      renderField(frameInfo);
    });
  }, []);

  const keyHandler = (e: KeyboardEvent) => {
    if (e.code == 'ArrowUp') {
      socket.current?.emit('moveClub1', -20);
    } else if (e.code == 'ArrowDown') {
      socket.current?.emit('moveClub1', 20);
    }
  };

  useEventListener('keydown', keyHandler, document);

  return (
    <>
      <canvas width={800} height={600} ref={canvasRef}></canvas>
    </>
  );
};

export default Pong;
