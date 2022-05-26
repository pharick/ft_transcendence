import { FC, useCallback, useEffect, useRef, useState } from 'react';
import { GameInfo, PendingGame, UserInfo } from '../types/interfaces';
import Link from 'next/link';
import { io, Socket } from 'socket.io-client';

interface GamesListProps {
  user?: UserInfo;
}

const GamesList: FC<GamesListProps> = ({ user }) => {
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
    socket.current = io('http://localhost:4000/pending');
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
      <ul className="game-list">
        {currentGames.map((game) => (
          <li key={game.gameId}>
            <p>Game <b>{game.player1.username}</b> vs <b>{game.player2.username}</b></p>
            <Link href={`/games/${game.gameId}`}>
              <a className="button">Play</a>
            </Link>
          </li>
        ))}

        {hostGames.map((game) => (
          <li key={game.id}>
            <p>Waiting for <b>{game.guestUser.username}</b></p>
          </li>
        ))}

        {guestGames.map((game) => (
          <li key={game.id}>
            <p><b>{game.hostUser.username}</b> invites you</p>
            <button onClick={() => { handleAccept(game.id).then() }}>Accept</button>
          </li>
        ))}
      </ul>
    </section>
  );
};

export default GamesList;
