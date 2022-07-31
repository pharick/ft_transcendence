import type { GetServerSideProps, NextPage } from 'next';
import dynamic from 'next/dynamic';
import Head from 'next/head';

import { GameInfo } from '../../types/interfaces';

const Pong = dynamic(() => import('../../components/games/pong'), {
  ssr: false,
});

interface GamePageProps {
  gameInfo: GameInfo;
}

export const getServerSideProps: GetServerSideProps = async (context) => {
  const gameId = context.params?.gameId;
  const response = await fetch(
    `${process.env.NEXT_PUBLIC_INTERNAL_API_URL}/games/${gameId}`,
  );
  if (response.status == 404) return { notFound: true };
  const gameInfo: GameInfo = await response.json();
  return { props: { gameInfo } };
};

const GamePage: NextPage<GamePageProps> = ({ gameInfo }) => {
  return (
    <>
      <Head>
        <title>
          Game {gameInfo.player1 ? gameInfo.player1.username : 'Mr. Wall'} vs{' '}
          {gameInfo.player2 ? gameInfo.player2.username : 'Mr. Wall'}
        </title>
      </Head>

      <h1>
        Game <b>{gameInfo.player1 ? gameInfo.player1.username : 'Mr. Wall'}</b>{' '}
        vs <b>{gameInfo.player2 ? gameInfo.player2.username : 'Mr. Wall'}</b>
      </h1>

      <Pong gameInfo={gameInfo} />
    </>
  );
};

export default GamePage;
