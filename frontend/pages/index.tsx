import type { NextPage } from 'next';
import Link from "next/link";
import { useEffect, useState } from "react";
import User from '../components/user';
import { GameInfo } from '../types/interfaces';

const Home: NextPage = () => {
  const [gameList, setGameList] = useState<Array<GameInfo>>();

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
      <User/>

      <h1>Games</h1>

      <ul>
        {gameList?.map((gameInfo: GameInfo) => (
          <li key={gameInfo.gameId}>
            <Link href={`/games/${gameInfo.gameId}`}>
              <a>{gameInfo.gameId}</a>
            </Link>
          </li>
        ))}
      </ul>

      <button onClick={handleCreateGame}>Создать игру</button>
    </>
  );
};

export default Home;
