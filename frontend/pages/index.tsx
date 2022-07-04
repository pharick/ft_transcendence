import type { NextPage } from 'next';

import TrainingModeButton from '../components/createTestGame';
import Chat from '../components/chat';
import { userContext } from '../components/userProvider';
import Head from 'next/head';

interface HomePageProps {}

const HomePage: NextPage<HomePageProps> = () => {
  return (
    <>
      <Head>
        <title>Main page</title>
      </Head>

      <userContext.Consumer>
        {({ user, userSessionId}) => (
          <Chat user={user} userSessionId={userSessionId} />
        )}
      </userContext.Consumer>

      <TrainingModeButton />
    </>
  );
};

export default HomePage;
