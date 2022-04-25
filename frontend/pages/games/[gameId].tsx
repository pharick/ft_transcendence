import type { GetServerSideProps, InferGetServerSidePropsType, NextPage } from 'next';
import dynamic from 'next/dynamic'

import { GameInfo } from '../../types/interfaces';
const Pong = dynamic(() => import('../../components/pong'), { ssr: false });

export const getServerSideProps: GetServerSideProps = async (context) => {
  const gameId = context.params?.gameId;
  const response = await fetch(`http://localhost:4000/games/${gameId}`);
  if (response.status == 404) return { notFound: true };
  const gameInfo: GameInfo = await response.json();
  return { props: { gameInfo } };
}

const GamePage: NextPage = ({ gameInfo }: InferGetServerSidePropsType<typeof getServerSideProps>) => {
  return (
    <>
      <h1>Game {gameInfo.gameId}</h1>
      {gameInfo.gameId && <Pong gameId={gameInfo.gameId} />}
    </>
  );
};

export default GamePage;
