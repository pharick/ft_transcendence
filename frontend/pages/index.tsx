import type { NextPage } from 'next';
import Head from 'next/head';

import { userContext } from '../components/users/userProvider';
import MatchMakingButton from "../components/games/createMatchMaking";
import TrainingModeButton from '../components/games/createTestGame';

const HomePage: NextPage = () => {
  return (
    <>
      <Head>
        <title>Main page</title>
      </Head>

      <TrainingModeButton />

      <userContext.Consumer>
        {({ user}) => (
          <MatchMakingButton user={user} />
        )}
      </userContext.Consumer>

    </>
  );
};

export default HomePage;
