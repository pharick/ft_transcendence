import React, { FC, useCallback, useEffect, useState } from 'react';
import { GameInfo, PendingGame, UserInfo } from '../../types/interfaces';
import Link from 'next/link';
import { io } from 'socket.io-client';
import ReadyGameBlock from './readyGameBlock';
import InviteGameBlock from './inviteGameBlock';
import WaitGameBlock from './waitGameBlock';

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

interface NotificationListProps {
  user?: UserInfo;
}

const NotificationList: FC<NotificationListProps> = ({ user }) => {
  const [hostGames, setHostGames] = useState<PendingGame[]>([]);
  const [guestGames, setGuestGames] = useState<PendingGame[]>([]);
  const [currentGames, setCurrentGames] = useState<GameInfo[]>([]);
  const [isConnected, setIsConnected] = useState(false);

  const getHostGames = useCallback(async () => {
    const response = await fetch(`/api/pending/host/${user?.id}`);
    const data = await response.json();
    setHostGames(data);
  }, [user]);

  const getGuestGames = useCallback(async () => {
    const response = await fetch(`/api/pending/guest/${user?.id}`);
    const data = await response.json();
    setGuestGames(data);
  }, [user]);

  const getCurrentGames = useCallback(async () => {
    const response = await fetch(`/api/games/my`);
    const data = await response.json();
    setCurrentGames(data);
  }, []);

  const handleUpdate = useCallback(async () => {
    await getHostGames();
    await getGuestGames();
    await getCurrentGames();
  }, [getCurrentGames, getGuestGames, getHostGames]);

  useEffect(() => {
    if (user) handleUpdate().then();

    socket.connect();

    socket.on('connect', () => {
      setIsConnected(true);
      socket.emit('introduce', user?.id);
    });

    socket.on('update', () => {
      handleUpdate().then();
    });

    return () => {
      socket.off('connect');
      socket.off('update');
      socket.disconnect();
    };
  }, [handleUpdate, user]);

  if (isConnected) {
    return (
      <section>
        {hostGames.length > 0 ||
        guestGames.length > 0 ||
        currentGames.length > 0 ? (
          <ul className="notification-list">
            {currentGames.map((game) => (
              <li key={game.gameId}>
                <ReadyGameBlock game={game} />
              </li>
            ))}

            {guestGames.map((game) => (
              <li key={game.id}>
                <InviteGameBlock game={game} />
              </li>
            ))}

            {hostGames.map((game) => (
              <li key={game.id}>
                <WaitGameBlock game={game} />
              </li>
            ))}
          </ul>
        ) : (
          <>
            <p>
              You don&apos;t have any invitations to the game, take the first step
              😉
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
      <>
        <div className="loader"></div>
        <p className="load-message">Load notifications...</p>
      </>
    );
  }
};

export default NotificationList;
