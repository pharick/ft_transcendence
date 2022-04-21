import type { NextPage } from 'next';
import Link from "next/link";
import { useEffect, useState } from "react";

const Home: NextPage = () => {
  const [gameList, setGameList] = useState<Array<string>>();

  const getGameList = async () => {
    const response = await fetch('/api/games/');
    const gameList = await response.json();
    setGameList(gameList);
  };

  const handleCreateGame = async () => {
    const response = await fetch('/api/games/', { method: 'POST' });
    await getGameList();
  };

  useEffect(() => {
    getGameList();
  }, []);

  return (
    <>
      <a href="https://api.intra.42.fr/oauth/authorize?client_id=8a4a10a3a225a1b0315f1872a786036f3104d8206cfd0a95b8ec2c48c5ac1d9a&redirect_uri=http%3A%2F%2Flocalhost%3A3000%2Fapi%2Fauth%2Flogin&response_type=code">
        LogIn
      </a>

      <h1>Список игр</h1>

      <ul>
        {gameList?.map((game_id: string) => (
          <li key={game_id}>
            <Link href={`/games/${game_id}`}><a>{game_id}</a></Link>
          </li>
        ))}
      </ul>

      <button onClick={handleCreateGame}>Создать игру</button>
    </>
  );
};

export default Home;
