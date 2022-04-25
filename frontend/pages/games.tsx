import type { NextPage } from 'next';
import Link from "next/link";
import { useState } from "react";
import User from '../components/user';
import { GameInfo } from '../types/interfaces';
import { GetServerSideProps, InferGetServerSidePropsType } from 'next';

export const getServerSideProps: GetServerSideProps = async (context) => {
  const response = await fetch('http://localhost:4000/games/');
  const initGameList: GameInfo[] = await response.json();
  return { props: { initGameList } };
}

const HomePage: NextPage = ({ initGameList }: InferGetServerSidePropsType<typeof getServerSideProps>) => {
  const [gameList, setGameList] = useState<GameInfo[]>(initGameList);

  const handleCreateGame = async () => {
    const response = await fetch('/api/games/', { method: 'POST' });
    const gameInfo: GameInfo = await response.json();
    setGameList((gameList) => [...gameList, gameInfo]);
  };

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

      <button onClick={handleCreateGame}>Create game</button>
    </>
  );
};

export default HomePage;
