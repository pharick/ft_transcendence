import type { GetServerSideProps, NextPage } from 'next';
import dynamic from 'next/dynamic';
import Head from 'next/head';

import { GameInfo } from '../../types/interfaces';
import { userContext } from '../../components/userProvider';

const Pong = dynamic(() => import('../../components/pong'), { ssr: false });

interface GamePageProps {
  gameInfo: GameInfo;
}

export const getServerSideProps: GetServerSideProps = async (context) => {
  const gameId = context.params?.gameId;
  const response = await fetch(`${process.env.INTERNAL_API_URL}/games/${gameId}`);
  if (response.status == 404) return { notFound: true };
  const gameInfo: GameInfo = await response.json();
  return { props: { gameInfo } };
};

const GamePage: NextPage<GamePageProps> = ({ gameInfo }) => {
  return (
    <>
      <Head>
        <title>Game {gameInfo.player1.username} vs {gameInfo.player2.username}</title>
      </Head>
      <h1>Game <b>{gameInfo.player1.username}</b> vs <b>{gameInfo.player2.username}</b></h1>

      <userContext.Consumer>
        {({ user, userSessionId }) => (
          <Pong gameInfo={gameInfo} user={user} userSessionId={userSessionId} />
        )}
      </userContext.Consumer>
    </>
  );
};

export default GamePage;
