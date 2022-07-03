import type { NextPage } from 'next';

import TrainingModeButton from '../components/createTestGame';
import Chat from '../components/chat';
import { userContext } from '../components/userProvider';

interface HomePageProps {}

const HomePage: NextPage<HomePageProps> = () => {
  return (
    <>
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
