import type { NextPage } from 'next';
import Head from 'next/head';

import { userContext } from '../../components/userProvider';
import Chat from '../../components/chat';
import SecondaryMenu from '../../components/secondaryMenu';

const CommonChatPage: NextPage = () => {
  return (
    <>
      <Head>
        <title>Common chat</title>
      </Head>

      <SecondaryMenu />

      <userContext.Consumer>
        {({ user, userSessionId}) => (
          <Chat user={user} userSessionId={userSessionId} />
        )}
      </userContext.Consumer>

    </>
  );
};

export default CommonChatPage;
