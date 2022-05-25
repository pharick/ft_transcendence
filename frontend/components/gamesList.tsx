import { FC, useCallback, useEffect, useState } from 'react';
import { PendingGame, UserInfo } from '../types/interfaces';

interface GamesListProps {
  user?: UserInfo;
}

const GamesList: FC<GamesListProps> = ({ user }) => {
  const [hostGames, setHostGames] = useState<PendingGame[]>([]);
  const [guestGames, setGuestGames] = useState<PendingGame[]>([]);

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

  useEffect(() => {
    getHostGames().then();
    getGuestGames().then();
  }, [getGuestGames, getHostGames]);

  return (
    <section>
      <ul>
        {hostGames.map((game) => (
          <li key={game.id}>
            <p>Ждем ответа от {game.guestUser.username}</p>
          </li>
        ))}

        {guestGames.map((game) => (
          <li key={game.id}>
            <p>Вас приглашает {game.hostUser.username}</p>
            <button onClick={() => { handleAccept(game.id).then() }}>Принять приглашение</button>
          </li>
        ))}
      </ul>
    </section>
  );
};

export default GamesList;
