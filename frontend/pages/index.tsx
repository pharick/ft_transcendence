import type { NextPage } from 'next';

import TrainingModeButton from '../components/createTestGame';
import Chat from '../components/chat';
import { userContext } from '../components/userProvider';

interface HomePageProps {}

const HomePage: NextPage<HomePageProps> = () => {
  return (
    <>
      <userContext.Consumer>
        {({ user}) => (
          <Chat user={user} />
        )}
      </userContext.Consumer>

      <TrainingModeButton />
    </>
  );
};

export default HomePage;
