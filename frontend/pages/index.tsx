import type { NextPage } from 'next';
import Head from 'next/head';

import MatchMakingButton from '../components/games/matchMakingButton';
import TrainingGameButton from '../components/games/trainingGameButton';
import Notifications from '../components/notifications/notifications';

const HomePage: NextPage = () => {
  return (
    <>
      <Head>
        <title>Main page</title>
      </Head>

      <section className="main-buttons">
        <TrainingGameButton />
        <MatchMakingButton />
      </section>

      <Notifications />
    </>
  );
};

export default HomePage;
