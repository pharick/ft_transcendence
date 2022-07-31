import { GetServerSideProps, NextPage } from 'next';
import Head from 'next/head';
import { ChatRoom } from '../../../types/interfaces';

interface PrivateChatPageProps {
  chatRoom: ChatRoom;
}

export const getServerSideProps: GetServerSideProps = async (context) => {
  const roomId = context.params?.roomId;
  const headers = context.req.headers.cookie ? { 'Cookie': context.req.headers.cookie } : undefined;
  const roomResponse = await fetch(
    `${process.env.NEXT_PUBLIC_INTERNAL_API_URL}/chat/rooms/${roomId}`,
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

      {/*<ChatRoomsMenu user={user} />*/}
      {/*<Chat user={user} userSessionId={userSessionId} room={chatRoom} />*/}

    </>
  );
};

export default PrivateChatPage;
