import type { NextPage } from 'next';

import TrainingModeButton from '../components/createTestGame';
import MatchMakingModeButton from "../components/createMatchMaking";

interface HomePageProps {}

const HomePage: NextPage<HomePageProps> = () => {
  return (
    <>
      <TrainingModeButton />
      <MatchMakingModeButton />
    </>
  );
};

export default HomePage;
