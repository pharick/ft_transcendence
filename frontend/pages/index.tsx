import type { NextPage } from 'next';

import { userContext } from '../components/userProvider';
import GamesList from '../components/gamesList';

interface HomePageProps {

}

const HomePage: NextPage<HomePageProps> = () => {
  return (
    <>
      <userContext.Consumer>
        {({ user }) => (
          <GamesList user={user} />
        )}
      </userContext.Consumer>
    </>
  );
};

export default HomePage;
