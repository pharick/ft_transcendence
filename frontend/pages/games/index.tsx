import type { NextPage } from 'next';
// import { GetServerSideProps } from 'next';

import { userContext } from '../../components/userProvider';
import UserBlock from '../../components/userBlock';
import Invites from '../../components/invites';

interface HomePageProps {

}

// export const getServerSideProps: GetServerSideProps = async () => {
//
// };

const HomePage: NextPage<HomePageProps> = () => {
  return (
    <>
      <userContext.Consumer>
        {({ user, handleLogout }) => (
          <UserBlock user={user} handleLogout={handleLogout} />
        )}
      </userContext.Consumer>

      <userContext.Consumer>
        {({ user }) => (
          <Invites user={user} />
        )}
      </userContext.Consumer>
    </>
  );
};

export default HomePage;
