import type { NextPage } from 'next';

import TrainingModeButton from '../components/createTestGame';

interface HomePageProps {}

const HomePage: NextPage<HomePageProps> = () => {
  return (
    <>
      <TrainingModeButton />
    </>
  );
};

export default HomePage;
