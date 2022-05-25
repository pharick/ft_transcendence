import { FC, useCallback, useEffect, useState } from 'react';
import { GameInfo, PendingGame, UserInfo } from '../types/interfaces';
import Link from 'next/link';

interface GamesListProps {
  user?: UserInfo;
}

const GamesList: FC<GamesListProps> = ({ user }) => {
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

  useEffect(() => {
    getHostGames().then();
    getGuestGames().then();
    getCurrentGames().then();
  }, [getGuestGames, getHostGames, getCurrentGames]);

  return (
    <section>
      <ul>
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
