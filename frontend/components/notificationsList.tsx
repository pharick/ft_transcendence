import { FC, useCallback, useEffect, useRef, useState } from 'react';
import { GameInfo, PendingGame, UserInfo } from '../types/interfaces';
import Link from 'next/link';
import { io, Socket } from 'socket.io-client';

interface NotificationsListProps {
  user?: UserInfo;
}

const NotificationsList: FC<NotificationsListProps> = ({ user }) => {
  const socket = useRef<Socket>();
  const [hostGames, setHostGames] = useState<PendingGame[]>([]);
  const [guestGames, setGuestGames] = useState<PendingGame[]>([]);
  const [currentGames, setCurrentGames] = useState<GameInfo[]>([]);

  const handleAccept = async (pendingGameId: number) => {
    const response = await fetch(
      `/api/pending/${pendingGameId}/accept`,
      { method: 'POST' }
    );
    console.log(response);
  };

  const handleRemove = async (pendingGameId: number) => {
    const response = await fetch(
      `/api/pending/${pendingGameId}`,
      { method: 'DELETE' }
    );
    console.log(response);
  };

  const getHostGames = useCallback(async () => {
    if (!user) return;
    const response = await fetch(`/api/pending/host/${user?.id}`);
    const data = await response.json();
    setHostGames(data);
  }, [user]);

  const getGuestGames = useCallback(async () => {
    if (!user) return;
    const response = await fetch(`/api/pending/guest/${user?.id}`);
    const data = await response.json();
    setGuestGames(data);
  }, [user]);

  const getCurrentGames = useCallback(async () => {
    if (!user) return;
    const response = await fetch(`/api/games/my`);
    const data = await response.json();
    setCurrentGames(data);
  }, [user]);

  const handleUpdate = useCallback(async () => {
    await getHostGames();
    await getGuestGames();
    await getCurrentGames();
  }, [getCurrentGames, getGuestGames, getHostGames]);

  useEffect(() => {
    handleUpdate().then();

    if (socket.current && socket.current?.active) return;
    socket.current = io('/pending');
    socket.current?.connect();

    socket.current?.on('update', () => {
      handleUpdate().then();
    });

    return () => {
      socket.current?.disconnect();
    };
  }, [handleUpdate]);

  return (
    <section>
      <ul className="notification-list">
        {currentGames.map((game) => (
          <li key={game.gameId}>
            <p>Game <b>{game.player1.username}</b> vs <b>{game.player2.username}</b></p>
            <Link href={`/games/${game.gameId}`}>
              <a className="button">Play</a>
            </Link>
          </li>
        ))}

        {guestGames.map((game) => (
          <li key={game.id}>
            <p><b>{game.hostUser.username}</b> invites you</p>
            <div>
              <button className="success-button" onClick={() => { handleAccept(game.id).then() }}>Accept</button>
              <button className="error-button" onClick={() => { handleRemove(game.id).then() }}>Decline</button>
            </div>
          </li>
        ))}

        {hostGames.map((game) => (
          <li key={game.id}>
            <p>Waiting for <b>{game.guestUser.username}</b></p>
            <button className="error-button" onClick={() => { handleRemove(game.id).then() }}>Cancel</button>
          </li>
        ))}
      </ul>
    </section>
  );
};

export default NotificationsList;
