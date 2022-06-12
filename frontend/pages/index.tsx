import type { NextPage } from 'next';

import { userContext } from '../components/userProvider';
import NotificationsList from '../components/notificationsList';
import TrainingModeButton from '../components/createTestGame';

interface HomePageProps {}

const HomePage: NextPage<HomePageProps> = () => {
  return (
    <>
      <userContext.Consumer>
        {({ user }) => <NotificationsList user={user} />}
      </userContext.Consumer>
      <TrainingModeButton />
    </>
  );
};

export default HomePage;
