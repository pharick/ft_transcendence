import React, { FC, useContext, useEffect, useState } from 'react';
import { io } from 'socket.io-client';
import ReadyGameBlock from './readyGameBlock';
import PendingGameBlock from './pendingGameBlock';
import { UserContext } from '../users/userProvider';
import Link from 'next/link';
import { Game, Notifications, PendingGame } from '../../types/interfaces';

const socket = io(
  `${
    process.env.NODE_ENV == 'development'
      ? process.env.NEXT_PUBLIC_INTERNAL_API_URL
      : ''
  }/notifications`,
  {
    autoConnect: false,
  },
);

const NotificationList: FC = () => {
  const userContext = useContext(UserContext);
  const [isConnected, setIsConnected] = useState(false);
  const [games, setGames] = useState<Game[]>([]);
  const [pendingGames, setPendingGames] = useState<PendingGame[]>([]);

  useEffect(() => {
    socket.auth = { token: localStorage.getItem('token') };
    socket.connect();

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
  }, [userContext.user]);

  if (isConnected) {
    return (
      <section>
        {games.length > 0 || pendingGames.length > 0 ? (
          <ul className="notification-list">
            {games.map((game) => (
              <li key={`game-${game.id}`}>
                <ReadyGameBlock game={game} />
              </li>
            ))}

            {pendingGames.map((game) => (
              <li key={`pending-${game.id}`}>
                <PendingGameBlock game={game} />
              </li>
            ))}
          </ul>
        ) : (
          <>
            <p>
              You don&apos;t have any invitations to the game, take the first
              step 😉
            </p>
            <ul>
              <li>
                <Link href="/users">
                  <a>Invite someone</a>
                </Link>
              </li>
            </ul>
          </>
        )}
      </section>
    );
  } else {
    return (
      <section>
        <div className="loader"></div>
        <p className="load-message">Load notifications...</p>
      </section>
    );
  }
};

export default NotificationList;
