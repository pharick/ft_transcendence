import type { NextPage } from 'next';
import { GetServerSideProps } from 'next';
import { Game } from '../../types/interfaces';
import GameList from '../../components/games/gameList';
import Head from 'next/head';

interface GamesPageProps {
  games: Game[];
}

export const getServerSideProps: GetServerSideProps = async () => {
  const response = await fetch(
    `${process.env.NEXT_PUBLIC_INTERNAL_API_URL}/games`,
  );
  const games: Game[] = await response.json();
  return { props: { games } };
};

const HomePage: NextPage<GamesPageProps> = ({ games }) => {
  return (
    <>
      <Head>
        <title>Ongoing games</title>
      </Head>

      <GameList games={games} />
    </>
  );
};

export default HomePage;
