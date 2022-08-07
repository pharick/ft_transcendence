import React, { FC, useContext, useEffect, useRef, useState } from 'react';
import { io } from 'socket.io-client';

import useKeyboardEventListener from '../../hooks/use_event_listener';
import { UserContext } from '../users/userProvider';
import { CompletedGame, Game, GameFrame } from '../../types/interfaces';
import {
  MoveClubStartDto,
  MoveClubStopDto,
  ResumeGameDto,
} from '../../types/dtos';
import { useRouter } from 'next/router';
import Image from 'next/image';
import UserBlockSmall from '../users/userBlockSmall';

const socket = io(
  `${
    process.env.NODE_ENV == 'development'
      ? process.env.NEXT_PUBLIC_INTERNAL_API_URL
      : ''
  }/game`,
  {
    autoConnect: false,
  },
);

interface PongProps {
  game: Game;
}

const GameField: FC<PongProps> = ({ game }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [score1, setScore1] = useState(0);
  const [score2, setScore2] = useState(0);
  const [pause, setPause] = useState(true);
  const [player1Turn, setPlayer1Turn] = useState(false);
  const [duration, setDuration] = useState(0);
  const [isConnected, setIsConnected] = useState(false);
  const userContext = useContext(UserContext);
  const router = useRouter();

  const defaultAvatarUrl = 'static/avatars/default.png';

  const renderField = ({
    ballX,
    ballY,
    ballRadius,
    clubWidth,
    clubHeightLeft,
    clubHeightRight,
    club1Pos,
    club2Pos,
    score1,
    score2,
    isPaused,
    isPlayer1Turn,
    durationMs,
  }: GameFrame) => {
    setPause(isPaused);
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
    setScore1(score1);
    setScore2(score2);

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

  useEffect(() => {
    socket.auth = { token: localStorage.getItem('token'), gameId: game.id };
    socket.connect();

    socket.on('connect', () => {
      setIsConnected(true);
    });

    socket.on('disconnect', () => {
      setIsConnected(false);
    });

    socket.on('nextFrame', (frame: GameFrame) => {
      renderField(frame);
    });

    socket.on('endGame', async (completedGame: CompletedGame) => {
      await router.push(`/completed/${completedGame.id}`);
    });

    return () => {
      socket.off('connect');
      socket.off('disconnect');
      socket.off('nextFrame');
      socket.off('endGame');
      socket.disconnect();
    };
  }, [game.id]);

  const keyDownHandler = (e: KeyboardEvent) => {
    if (
      game.player1?.id != userContext.user?.id &&
      game.player2?.id != userContext.user?.id
    )
      return;

    if (e.code == 'Space') {
      const resumeGameDto: ResumeGameDto = { gameId: game.id };
      socket.emit('resume', resumeGameDto);
    } else if (e.code == 'KeyW' || e.code == 'KeyS') {
      const moveClubStartDto: MoveClubStartDto = {
        gameId: game.id,
        up: e.code == 'KeyW',
      };
      socket.emit('moveClubStart', moveClubStartDto);
    }
  };

  const keyUpHandler = (e: KeyboardEvent) => {
    if (
      game.player1?.id != userContext.user?.id &&
      game.player2?.id != userContext.user?.id
    )
      return;

    if (e.code == 'KeyW' || e.code == 'KeyS') {
      const moveClubStopDto: MoveClubStopDto = { gameId: game.id };
      socket.emit('moveClubStop', moveClubStopDto);
    }
  };

  useKeyboardEventListener(
    'keydown',
    keyDownHandler as EventListener,
    document,
  );
  useKeyboardEventListener('keyup', keyUpHandler as EventListener, document);

  return (
    <>
      <div className="field-wrapper">
        {pause && (
          <p className="pause-message">
            {!game.player1 ||
            !game.player2 ||
            (game.player1.id == userContext.user?.id && player1Turn) ||
            (game.player2.id == userContext.user?.id && !player1Turn)
              ? 'Press SPACE to continue'
              : 'Waiting for opponent'}
          </p>
        )}
        <p className="pong-time">Time: {duration}</p>
        <p className="score score1">{score1}</p>
        <p className="score score2">{score2}</p>

        {!isConnected && (
          <div className="pong-loader">
            <div className="loader"></div>
            <p className="load-message">Load game...</p>
          </div>
        )}

        <canvas
          width={game.fieldWidth}
          height={game.fieldHeight}
          className="field"
          ref={canvasRef}
        ></canvas>
      </div>

      <div className="pong-players" style={{ width: game.fieldWidth }}>
        <div className={`pong-players-part ${player1Turn ? 'current' : ''}`}>
          <UserBlockSmall user={game.player1} />
        </div>
        <div className={`pong-players-part ${!player1Turn ? 'current' : ''}`}>
          <div className="avatar-placeholder-small"></div>
          <UserBlockSmall user={game.player2} />
        </div>
      </div>
    </>
  );
};

export default GameField;
