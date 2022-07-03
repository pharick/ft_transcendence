import type { NextPage } from 'next';

import TrainingModeButton from '../components/createTestGame';
import Chat from '../components/chat';

interface HomePageProps {}

const HomePage: NextPage<HomePageProps> = () => {
  return (
    <>
      <Chat />
      <TrainingModeButton />
    </>
  );
};

export default HomePage;
