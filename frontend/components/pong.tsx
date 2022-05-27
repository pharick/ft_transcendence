import { FC, useEffect, useRef, useState } from 'react';
import { io, Socket } from 'socket.io-client';

import useEventListener from '../hooks/use_event_listener';
import { FrameInfo, GameInfo, UserInfo } from '../types/interfaces';

interface PongProps {
  gameInfo: GameInfo;
  user: UserInfo | undefined;
  userSessionId: string | undefined;
}

const Pong: FC<PongProps> = ({ gameInfo, user, userSessionId }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const socket = useRef<Socket>();
  const [score1, setScore1] = useState(0);
  const [score2, setScore2] = useState(0);

  const renderField = ({
    ballX,
    ballY,
    ballRadius,
    clubWidth,
    clubHeight,
    club1Pos,
    club2Pos,
    scores,
  }: FrameInfo) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');

    if (!canvas || !ctx) {
      console.log(
        'Update your browser, canvas is not supported in the current version',
      );
      return;
    }

    const ballSize = ballRadius * 2;
    const paddleTab = ballSize;

    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // playground
    ctx.fillStyle = 'black';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // score
    setScore1(scores.player1);
    setScore2(scores.player2);

    // center line
    ctx.fillStyle = 'lightgrey';
    for (let y = ballSize; y < canvas.height - ballSize; y += ballSize * 2) {
      ctx.fillRect(
        canvas.width / 2 - ballSize / 2, y,
        ballSize / 4, ballSize / 2,
      );
    }

    // ball
    ctx.fillStyle = 'white';
    ctx.fillRect(ballX, ballY, ballSize, ballSize);

    // clubs
    ctx.fillRect(paddleTab, club1Pos - clubHeight / 2, clubWidth, clubHeight);
    ctx.fillRect(
      canvas.width - paddleTab - ballSize,
      club2Pos - clubHeight / 2,
      clubWidth, clubHeight,
    );
  };

  const toggleGameRunning = async () => {
    const response = await fetch(`/api/games/${gameInfo.gameId}/toggle`, {
      method: 'POST',
    });
  };

  useEffect(() => {
    if (socket.current && socket.current?.active) return;

    socket.current = io('http://localhost:4000/game');
    socket.current?.connect();
    socket.current?.emit('connectToGame', gameInfo.gameId);

    socket.current?.on('nextFrame', (frame: FrameInfo) => {
      renderField(frame);
    });

    return () => {
      socket.current?.disconnect();
    };
  }, [gameInfo.gameId]);

  const keyDownHandler = (e: KeyboardEvent) => {
    if (e.code != 'ArrowUp' && e.code != 'ArrowDown') return;
    const up = e.code == 'ArrowUp';

    if (gameInfo.player1?.id == user?.id || gameInfo.player2?.id == user?.id) {
      const gameId = gameInfo.gameId;
      socket.current?.emit('moveClubStart', { gameId, userSessionId, up });
    }
  };

  const keyUpHandler = (e: KeyboardEvent) => {
    if (e.code != 'ArrowUp' && e.code != 'ArrowDown') return;

    if (gameInfo.player1?.id == user?.id || gameInfo.player2?.id == user?.id) {
      const gameId = gameInfo.gameId;
      socket.current?.emit('moveClubStop', { gameId, userSessionId });
    }
  };

  useEventListener('keydown', keyDownHandler, document);
  useEventListener('keyup', keyUpHandler, document);

  return (
    <>
      <div className="field-wrapper">
        <p className="score score1">{score1}</p>
        <p className="score score2">{score2}</p>
        <canvas
          width={gameInfo.field.width}
          height={gameInfo.field.height}
          className="field"
          ref={canvasRef}
        ></canvas>
      </div>
      <button onClick={toggleGameRunning}>Run / Pause</button>
    </>
  );
};

export default Pong;
