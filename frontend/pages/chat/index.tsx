import type { NextPage } from 'next';
import Head from 'next/head';

import { userContext } from '../../components/users/userProvider';
import Chat from '../../components/chats/chat';
import ChatRoomsMenu from '../../components/chats/chatRoomsMenu';

const CommonChatPage: NextPage = () => {
  return (
    <>
      <Head>
        <title>Common chat</title>
      </Head>

      <userContext.Consumer>
        {({ user, userSessionId}) => (
          <>
            {user && <ChatRoomsMenu user={user} />}
            <Chat user={user} userSessionId={userSessionId} />
          </>
        )}
      </userContext.Consumer>

    </>
  );
};

export default CommonChatPage;
