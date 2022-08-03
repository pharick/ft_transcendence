import type { GetServerSideProps, NextPage } from 'next';
import dynamic from 'next/dynamic';
import Head from 'next/head';
import { Game } from '../../types/interfaces';

const GameField = dynamic(() => import('../../components/games/gameField'), {
  ssr: false,
});

interface GamePageProps {
  game: Game;
}

export const getServerSideProps: GetServerSideProps = async (context) => {
  const gameId = context.params?.gameId;
  const response = await fetch(
    `${process.env.NEXT_PUBLIC_INTERNAL_API_URL}/games/${gameId}`,
  );
  if (response.status == 404) return { notFound: true };
  const game: Game = await response.json();
  return { props: { game } };
};

const GamePage: NextPage<GamePageProps> = ({ game }) => {
  return (
    <>
      <Head>
        <title>
          Game {game.player1.username} vs{' '}
          {game.player2 ? game.player2.username : 'Mr. Wall'}
        </title>
      </Head>

      <h1>
        Game <b>{game.player1 ? game.player1.username : 'Mr. Wall'}</b> vs{' '}
        <b>{game.player2 ? game.player2.username : 'Mr. Wall'}</b>
      </h1>

      <GameField game={game} />
    </>
  );
};

export default GamePage;
