import { FC, useEffect, useRef, useState } from 'react';
import { io, Socket } from 'socket.io-client';

import useEventListener from '../hooks/use_event_listener';
import {
  CompletedGameInfo,
  FrameInfo,
  GameInfo,
  UserInfo,
} from '../types/interfaces';

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
  const [pause, setPause] = useState(true);
  const [player1Turn, setPlayer1Turn] = useState(false);
  const [duration, setDuration] = useState(0);

  const renderField = ({
                         ballX,
                         ballY,
                         ballRadius,
                         clubWidth,
                         clubHeightLeft,
                         clubHeightRight,
                         club1Pos,
                         club2Pos,
                         scores,
                         isPause,
                         isPlayer1Turn,
                         durationMs,
                       }: FrameInfo) => {
    setPause(isPause);
    setPlayer1Turn(isPlayer1Turn);
    setDuration(Math.round(durationMs / 1000));

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
        canvas.width / 2 - ballSize / 8,
        y,
        ballSize / 4,
        ballSize / 2,
      );
    }

    // ball
    ctx.fillStyle = 'white';
    ctx.fillRect(ballX - ballRadius, ballY - ballRadius, ballSize, ballSize);

    // clubs
    ctx.fillRect(
      paddleTab,
      club1Pos - clubHeightLeft / 2,
      clubWidth,
      clubHeightLeft,
    );
    ctx.fillRect(
      canvas.width - paddleTab - ballSize,
      club2Pos - clubHeightRight / 2,
      clubWidth,
      clubHeightRight,
    );
  };

  const resumeGame = async () => {
    const response = await fetch(`/api/games/${gameInfo.gameId}/resume`, {
      method: 'POST',
    });
  };

  useEffect(() => {
    if (socket.current && socket.current?.active) return;

    socket.current = io(
      `${
        process.env.NODE_ENV == 'development'
          ? process.env.NEXT_PUBLIC_INTERNAL_API_URL
          : ''
      }/game`,
    );
    socket.current?.connect();
    socket.current?.emit('connectToGame', gameInfo.gameId);

    socket.current?.on('nextFrame', (frame: FrameInfo) => {
      renderField(frame);
    });

    socket.current?.on('endGame', (completedGameInfo: CompletedGameInfo) => {
      window.location.replace(`/completed/${completedGameInfo.id}`);
    });

    return () => {
      socket.current?.disconnect();
    };
  }, [gameInfo.gameId]);

  const keyDownHandler = (e: KeyboardEvent) => {
    if (
      e.code == 'Space' &&
      (gameInfo.player1.id == user?.id && player1Turn ||
        gameInfo.player2.id == user?.id && !player1Turn)
    ) {
      resumeGame().then();
      return;
    }

    if (e.code != 'KeyW' && e.code != 'KeyS') return;
    const up = e.code == 'KeyW';

    if (gameInfo.player1?.id == user?.id || gameInfo.player2?.id == user?.id) {
      const gameId = gameInfo.gameId;
      socket.current?.emit('moveClubStart', { gameId, userSessionId, up });
    }
  };

  const keyUpHandler = (e: KeyboardEvent) => {
    if (e.code != 'KeyW' && e.code != 'KeyS') return;

    if (gameInfo.player1?.id == user?.id || gameInfo.player2?.id == user?.id) {
      const gameId = gameInfo.gameId;
      socket.current?.emit('moveClubStop', { gameId, userSessionId });
    }
  };

  useEventListener('keydown', keyDownHandler, document);
  useEventListener('keyup', keyUpHandler, document);

  return (
    <>
      <div className='field-wrapper'>
        {pause && <p className='pause-message'>
          {
            !gameInfo.player1 || !gameInfo.player2 ||
            gameInfo.player1.id == user?.id && player1Turn ||
            gameInfo.player2.id == user?.id && !player1Turn ?
              'Press SPACE to continue' :
              'Waiting for opponent'
          }
        </p>}
        <p className='pong-time'>Time: {duration}</p>
        <p className='score score1'>{score1}</p>
        <p className='score score2'>{score2}</p>
        <canvas
          width={gameInfo.field.width}
          height={gameInfo.field.height}
          className='field'
          ref={canvasRef}
        ></canvas>
      </div>

      <div className='pong-players' style={{ width: gameInfo.field.width }}>
        <div className={`pong-players-part ${player1Turn ? 'current' : ''}`}>
          <div className='avatar-placeholder-small'></div>
          <p className='pong-players-name'>
            {gameInfo.player1 ? gameInfo.player1.username : 'Mr. Wall'}
          </p>
        </div>
        <div className={`pong-players-part ${!player1Turn ? 'current' : ''}`}>
          <div className='avatar-placeholder-small'></div>
          <p className='pong-players-name'>
            {gameInfo.player2 ? gameInfo.player2.username : 'Mr. Wall'}
          </p>
        </div>
      </div>
    </>
  );
};

export default Pong;
