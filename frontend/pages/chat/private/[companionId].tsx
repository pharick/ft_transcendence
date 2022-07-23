import { GetServerSideProps, NextPage } from 'next';
import Head from 'next/head';
import { ChatRoom } from '../../../types/interfaces';
import Chat from '../../../components/chat';
import { userContext } from '../../../components/userProvider';

interface PrivateChatPageProps {
  chatRoom: ChatRoom;
}

export const getServerSideProps: GetServerSideProps = async (context) => {
  const companionId = context.params?.companionId;
  const headers = context.req.headers.cookie ? { 'Cookie': context.req.headers.cookie } : undefined;
  const roomResponse = await fetch(
    `${process.env.NEXT_PUBLIC_INTERNAL_API_URL}/chat/rooms/private/${companionId}`,
    { headers: headers},
  );
  if (roomResponse.status == 404 || roomResponse.status == 401) return { notFound: true };
  const chatRoom: ChatRoom = await roomResponse.json();
  return { props: { chatRoom } };
};

const PrivateChatPage: NextPage<PrivateChatPageProps> = ({ chatRoom }) => {
  return (
    <>
      <Head>
        <title>Private chat</title>
      </Head>

      <userContext.Consumer>
        {({ user, userSessionId}) => (
          <Chat user={user} userSessionId={userSessionId} room={chatRoom} />
        )}
      </userContext.Consumer>
    </>
  );
};

export default PrivateChatPage;