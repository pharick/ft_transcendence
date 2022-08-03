import type { NextPage } from 'next';
import Head from 'next/head';

import MatchMakingButton from '../components/games/createMatchMaking';
import TrainingGameButton from '../components/games/trainingGameButton';

const HomePage: NextPage = () => {
  return (
    <>
      <Head>
        <title>Main page</title>
      </Head>

      <TrainingGameButton />
      <MatchMakingButton />
    </>
  );
};

export default HomePage;
