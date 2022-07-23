import type { NextPage } from 'next';
import Head from 'next/head';

import { userContext } from '../components/userProvider';
import MatchMakingModeButton from "../components/createMatchMaking";
import TrainingModeButton from '../components/createTestGame';

const HomePage: NextPage = () => {
  return (
    <>
      <Head>
        <title>Main page</title>
      </Head>

      <TrainingModeButton />

      <userContext.Consumer>
        {({ user}) => (
          <MatchMakingModeButton user={user} />
        )}
      </userContext.Consumer>

    </>
  );
};

export default HomePage;
