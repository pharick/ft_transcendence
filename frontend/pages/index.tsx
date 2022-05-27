import type { NextPage } from 'next';

import { userContext } from '../components/userProvider';
import NotificationsList from '../components/notificationsList';

interface HomePageProps {

}

const HomePage: NextPage<HomePageProps> = () => {
  return (
    <>
      <userContext.Consumer>
        {({ user }) => (
          <NotificationsList user={user} />
        )}
      </userContext.Consumer>
    </>
  );
};

export default HomePage;
