import type { NextPage } from 'next';
import Head from 'next/head';

import MatchMakingButton from '../components/games/createMatchMaking';
import TrainingModeButton from '../components/games/createTestGame';

const HomePage: NextPage = () => {
  return (
    <>
      <Head>
        <title>Main page</title>
      </Head>

      <TrainingModeButton />
      <MatchMakingButton />
    </>
  );
};

export default HomePage;
