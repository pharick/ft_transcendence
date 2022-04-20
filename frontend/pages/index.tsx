import type { NextPage } from 'next';
import Link from "next/link";
import {useEffect, useState} from "react";

const Home: NextPage = () => {
  const [gameList, setGameList] = useState<Array<string>>();

  const getGameList = async () => {
    const response = await fetch('http://localhost:3000/games/');
    const gameList = await response.json();
    setGameList(gameList);
  };

  const handleCreateGame = async () => {
    const response = await fetch('http://localhost:3000/games/', { method: 'POST' });
    await getGameList();
  };

  useEffect(() => {
    getGameList();
  }, []);

  return (
    <>
      <h1>Список игр</h1>

      <ul>
        {gameList?.map((game_id: string) => (
          <li key={game_id}>
            <Link href={`/game/${game_id}`}><a>{game_id}</a></Link>
          </li>
        ))}
      </ul>

      <button onClick={handleCreateGame}>Создать игру</button>
    </>
  );
};

export default Home;
