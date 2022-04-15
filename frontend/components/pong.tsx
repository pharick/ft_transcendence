import { FC, useRef, useState } from 'react';

import useEventListener from '../hooks/use_event_listener';
import useInterval from '../hooks/use_interval';

const Pong: FC = () => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  const [club1Pos, setClub1Pos] = useState(300);

  const renderField = () => {
    const canvas = canvasRef.current;
    const ctx = canvasRef.current?.getContext('2d');
    if (!canvas || !ctx) return;

    ctx.fillStyle = 'rgb(0, 0, 0)';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    ctx.fillStyle = 'rgb(255, 255, 255)';
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
      <canvas width="800" height="600" ref={canvasRef}></canvas>
    </>
  );
};

export default Pong;
