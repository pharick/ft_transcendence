import type { GetServerSideProps, NextPage } from 'next';
import dynamic from 'next/dynamic'

import { GameInfo } from '../../types/interfaces';
import UserBlock from '../../components/userBlock';
import { userContext } from '../../components/userProvider';
const Pong = dynamic(() => import('../../components/pong'), { ssr: false });

interface GamePageProps {
  gameInfo: GameInfo;
}

export const getServerSideProps: GetServerSideProps = async (context) => {
  const gameId = context.params?.gameId;
  const response = await fetch(`http://localhost:3000/api/games/${gameId}`);
  if (response.status == 404) return { notFound: true };
  const gameInfo: GameInfo = await response.json();
  return { props: { gameInfo } };
}

const GamePage: NextPage<GamePageProps> = ({ gameInfo }) => {
  return (
    <>
      <h1>Game {gameInfo.gameId}</h1>

      <userContext.Consumer>
        {({ user }) => (
          <Pong gameInfo={gameInfo} user={user} />
        )}
      </userContext.Consumer>


    </>
  );
};

export default GamePage;
