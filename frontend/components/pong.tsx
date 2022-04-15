import {FC, useEffect, useRef, useState} from 'react';
import { io, Socket } from "socket.io-client";

import useEventListener from '../hooks/use_event_listener';
import useInterval from '../hooks/use_interval';

export interface FrameInfo {
  ballX: number;
  ballY: number;
}

const Pong: FC = () => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const socket = useRef<Socket | null>(null);

  const [club1Pos, setClub1Pos] = useState(300);
  const [frameInfo, setFrameInfo] = useState<FrameInfo>();

  useEffect(() => {
    if (socket.current)
      return;
    socket.current = io('ws://localhost:3000');
    socket.current?.on('frameInfo', (frameInfo: FrameInfo) => {
      console.log(frameInfo);
      setFrameInfo(frameInfo);
    });
  }, []);

  const renderField = () => {
    const canvas = canvasRef.current;
    const ctx = canvasRef.current?.getContext('2d');
    if (!canvas || !ctx || !frameInfo) return;

    ctx.clearRect(0, 0, canvas.width, canvas.height);

    ctx.fillStyle = 'rgb(0, 0, 0)';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    ctx.fillStyle = 'rgb(255, 255, 255)';

    ctx.beginPath();
    ctx.arc(frameInfo.ballX, frameInfo.ballY, 10, 0, 2 * Math.PI);
    ctx.fill();

    ctx.fillRect(20, club1Pos - 80, 20, 160);
  };

  useInterval(renderField, 10);

  const keyHandler = (e: KeyboardEvent) => {
    if (e.code == 'ArrowUp') {
      setClub1Pos(pos => pos - 10);
    } else if (e.code == 'ArrowDown') {
      setClub1Pos(pos => pos + 10);
    }
  };

  useEventListener('keydown', keyHandler, document);

  return (
    <>
      <p>Club pos: {club1Pos}</p>
      <p>Frame info: {JSON.stringify(frameInfo)}</p>
      <canvas width="800" height="600" ref={canvasRef}></canvas>
    </>
  );
};

export default Pong;
