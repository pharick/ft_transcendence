import type { NextPage } from 'next';
import { GetServerSideProps } from 'next';
import { GameInfo } from '../../types/interfaces';
import GameList from '../../components/gameList';
import { userContext } from '../../components/userProvider';

interface GamesPageProps {
  games: GameInfo[],
}

export const getServerSideProps: GetServerSideProps = async () => {
  const response = await fetch(`${process.env.NEXT_PUBLIC_INTERNAL_API_URL}/games`);
  const games: GameInfo[] = await response.json();
  return { props: { games } };
};

const HomePage: NextPage<GamesPageProps> = ({ games }) => {
  return (
    <userContext.Consumer>
      {({ user }) => (
        <GameList games={games} user={user}/>
      )}
    </userContext.Consumer>
  );
};

export default HomePage;
