import React, { FC, useContext, useEffect, useState } from 'react';
import { io } from 'socket.io-client';
import ReadyGameBlock from './readyGameBlock';
import PendingGameBlock from './pendingGameBlock';
import { Game, Notifications, PendingGame } from '../../types/interfaces';
import { UserContext } from '../users/userProvider';
import styles from '../../styles/Notifications.module.css';
import TableTopTen from './tableTopTen';

const Notifications: FC = () => {
  const [isConnected, setIsConnected] = useState(false);
  const [games, setGames] = useState<Game[]>([]);
  const [pendingGames, setPendingGames] = useState<PendingGame[]>([]);
  const userContext = useContext(UserContext);

  useEffect(() => {
    setGames([]);
    setPendingGames([]);

    const socket = io(
      `${
        process.env.NODE_ENV == 'development'
          ? process.env.NEXT_PUBLIC_INTERNAL_API_URL
          : ''
      }/notifications`,
      {
        auth: { token: localStorage.getItem('token') },
      },
    );

    socket.on('connect', () => {
      setIsConnected(true);
    });

    socket.on('disconnect', () => {
      setIsConnected(false);
      setGames([]);
      setPendingGames([]);
    });

    socket.on('notifications', (notifications: Notifications) => {
      setGames(notifications.games);
      setPendingGames(notifications.pending);
    });

    return () => {
      socket.off('connect');
      socket.off('disconnect');
      socket.off('newMessages');
      socket.disconnect();
    };
  }, [userContext.user?.id]);

  if (isConnected) {
    return (
      <section className={`row flex-grow-1 ${styles.notifications}`}>
        <div className={`col-md ${styles.section}`}>
          <div className={`row flex-grow-1 ${styles.notifications}`}>
            <h2>Ongoing games</h2>
            {games.length > 0 ? (
              <ul className={styles.list}>
                {games.map((game) => (
                  <li key={`game-${game.id}`}>
                    <ReadyGameBlock game={game} />
                  </li>
                ))}
              </ul>
            ) : (
              <p>You don&apos;t have any ongoing games</p>
            )}
          </div>
          <div className={`row flex-grow-1 ${styles.notifications}`}>
            <h2>Pending games</h2>
            {pendingGames.length > 0 ? (
              <ul className={styles.list}>
                {pendingGames.map((game) => (
                  <li key={`pending-${game.id}`}>
                    <PendingGameBlock game={game} />
                  </li>
                ))}
              </ul>
            ) : (
              <p>
                You don&apos;t have any invitations to the game, take the first
                step 😉
              </p>
            )}
          </div>
        </div>

        <div className={`col-md ${styles.section}`}>
          <h2>Top-10 leadership board</h2>
          <TableTopTen />
        </div>
      </section>
    );
  } else {
    return (
      <section>
        <div className="loader"></div>
        <p className="loader-message">Load notifications...</p>
      </section>
    );
  }
};

export default Notifications;
