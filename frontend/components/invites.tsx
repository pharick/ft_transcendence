import { FC, useEffect, useState } from 'react';
import { PendingGame, UserInfo } from '../types/interfaces';

interface InvitesProps {
  user?: UserInfo;
}

const Invites: FC<InvitesProps> = ({ user }) => {
  const [hostGames, setHostGames] = useState<PendingGame[]>([]);
  const [guestGames, setGuestGames] = useState<PendingGame[]>([]);

  const handleAccept = async (pendingGameId: number) => {
    const response = await fetch(
      `/api/pending/${pendingGameId}/accept`,
      { method: 'POST' }
    );
    console.log(response);
  };

  useEffect(() => {
    const getHostGames = async () => {
      if (!user) return;
      const response = await fetch(`/api/pending/host/${user?.id}`);
      const data = await response.json();
      setHostGames(data);
    };

    const getGuestGames = async () => {
      if (!user) return;
      const response = await fetch(`/api/pending/guest/${user?.id}`);
      const data = await response.json();
      setGuestGames(data);
    };

    getHostGames().then();
    getGuestGames().then();
  }, [user]);

  return (
    <section>
      <h3>Вы приглашаете</h3>
      <ul>
        {hostGames.map((game) => (
          <li key={game.id}>
            {game.guestUser.username}
          </li>
        ))}
      </ul>

      <h3>Вас приглашают</h3>
      <ul>
        {guestGames.map((game) => (
          <li key={game.id}>
            <p>{game.hostUser.username}</p>
            <button onClick={() => { handleAccept(game.id).then() }}>Принять приглашение</button>
          </li>
        ))}
      </ul>
    </section>
  );
};

export default Invites;
