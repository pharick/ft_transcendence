import type { NextPage } from 'next';
import Link from "next/link";
import { useState } from "react";
import { GetServerSideProps } from 'next';

import { userContext } from '../../components/userProvider';
import UserBlock from '../../components/userBlock';
import { GameInfo, User } from '../../types/interfaces';

interface HomePageProps {
  initGameList: GameInfo[];
  initUser: User;
}

export const getServerSideProps: GetServerSideProps = async () => {
  const response = await fetch('http://localhost:3000/api/games/');
  const initGameList: GameInfo[] = await response.json();
  return { props: { initGameList } };
}

const HomePage: NextPage<HomePageProps> = ({ initGameList }) => {
  const [gameList, setGameList] = useState<GameInfo[]>(initGameList);

  const handleCreateGame = async () => {
    const response = await fetch('/api/games/', { method: 'POST' });
    if (response.status == 401) return;
    const gameInfo: GameInfo = await response.json();
    setGameList((gameList) => [...gameList, gameInfo]);
  };

  return (
    <>
      <userContext.Consumer>
        {({ user, handleLogout }) => (
          <UserBlock user={user} handleLogout={handleLogout} />
        )}
      </userContext.Consumer>


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
