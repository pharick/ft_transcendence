import React, { FC, useContext, useEffect, useRef, useState } from 'react';
import { io, Socket } from 'socket.io-client';

import useKeyboardEventListener from '../../hooks/use_event_listener';
import { UserContext } from '../users/userProvider';
import {
  CompletedGame,
  Game,
  GameClients,
  GameFrame,
  GameStatus,
} from '../../types/interfaces';
import {
  MoveClubStartDto,
  MoveClubStopDto,
  ResumeGameDto,
} from '../../types/dtos';
import { useRouter } from 'next/router';
import PlayerBlockSmall from '../users/playerBlockSmall';

import styles from '../../styles/GameField.module.css';
import WatcherList from './watcherList';

interface PongProps {
  game: Game;
}

const GameField: FC<PongProps> = ({ game }) => {
  const [socket, setSocket] = useState<Socket>();
  const [score1, setScore1] = useState(0);
  const [score2, setScore2] = useState(0);
  const [status, setStatus] = useState<GameStatus>();
  const [duration, setDuration] = useState(0);
  const [clients, setClients] = useState<GameClients>({
    watchers: [],
    player1online: false,
    player2online: false,
  });

  const canvasRef = useRef<HTMLCanvasElement>(null);
  const userContext = useContext(UserContext);
  const router = useRouter();

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
    status,
    durationMs,
    barriers,
  }: GameFrame) => {
    setStatus(status);
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

    // wall
    ctx.fillStyle = 'white';
    // console.log(`${wallPos}`);
    for (const barrier of barriers) {
      ctx.fillRect(
        canvas.width / 2 - barrier.width / 2,
        barrier.y - barrier.height / 2,
        barrier.width,
        barrier.height,
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
    const socket = io(
      `${
        process.env.NODE_ENV == 'development'
          ? process.env.NEXT_PUBLIC_INTERNAL_API_URL
          : ''
      }/game`,
      {
        auth: { token: localStorage.getItem('token'), gameId: game.id },
      },
    );

    socket.on('nextFrame', (frame: GameFrame) => {
      renderField(frame);
    });

    socket.on('sendClients', (newClients: GameClients) => {
      setClients(newClients);
    });

    socket.on('endGame', async (completedGame: CompletedGame) => {
      if (!completedGame) await router.push('/');
      else await router.push(`/completed/${completedGame.id}`);
    });

    setSocket(socket);

    return () => {
      socket.off('connect');
      socket.off('disconnect');
      socket.off('nextFrame');
      socket.off('sendClients');
      socket.off('endGame');
      socket.disconnect();
    };
  }, []);

  const keyDownHandler = (e: KeyboardEvent) => {
    if (
      game.player1.id != userContext.user?.id &&
      game.player2.id != userContext.user?.id
    )
      return;

    if (e.code == 'Space') {
      e.preventDefault();
      const resumeGameDto: ResumeGameDto = { gameId: game.id };
      socket.emit('serve', resumeGameDto);
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
      game.player1.id != userContext.user?.id &&
      game.player2.id != userContext.user?.id
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

  let message;
  if (
    game.player1.id != userContext.user?.id &&
    game.player2.id != userContext.user?.id
  )
    message =
      status == GameStatus.Player1Serve ? 'Player 1 serve' : 'Player 2 serve';
  else if (
    (status == GameStatus.Player1Serve &&
      game.player1.id == userContext.user?.id) ||
    (status == GameStatus.Player2Serve &&
      game.player2.id == userContext.user?.id)
  )
    message = 'Press SPACE to serve';
  else message = 'Opponent serve';

  return (
    <div className="row justify-content-center">
      <div className="col-auto">
        <div className={styles.fieldWrapper}>
          {(status == GameStatus.Player1Serve ||
            status == GameStatus.Player2Serve) && (
            <p className={styles.message}>{message}</p>
          )}
          <p className={styles.time}>Time: {duration}</p>
          <p className={`${styles.score} ${styles.score1}`}>{score1}</p>
          <p className={`${styles.score} ${styles.score2}`}>{score2}</p>

          {socket && !socket.connected && (
            <div className={styles.gameLoader}>
              <div className="loader"></div>
              <p className="loader-message">Load game...</p>
            </div>
          )}

          {!game.isTraining &&
            (!clients.player1online || !clients.player2online) && (
              <div className={styles.gameLoader}>
                <div className="loader"></div>
                <p className="loader-message">Opponent offline...</p>
              </div>
            )}

          <canvas
            width={game.fieldWidth}
            height={game.fieldHeight}
            ref={canvasRef}
          ></canvas>
        </div>

        <div className={styles.players} style={{ width: game.fieldWidth }}>
          <div
            className={`${styles.playersPart} ${
              status == GameStatus.Player1Serve ? styles.playersPartCurrent : ''
            }`}
          >
            <PlayerBlockSmall user={game.player1} />
          </div>
          <div
            className={`${styles.playersPart} ${
              status == GameStatus.Player2Serve ? styles.playersPartCurrent : ''
            }`}
          >
            <PlayerBlockSmall user={game.player2} />
          </div>
        </div>
      </div>

      <div className="col">
        <div className={styles.rules}>
          <h2 className="m-0">Controls and rules</h2>
          <ul className={styles.rulesList}>
            <li>
              <span className="key-label">W</span> — club up,{' '}
              <span className="key-label">S</span> — club down
            </li>
            <li>Play up to 11 points</li>
          </ul>
        </div>
        <WatcherList watchers={clients.watchers} />
      </div>
    </div>
  );
};

export default GameField;
