import type { NextPage } from 'next';
import Head from 'next/head';
import React from 'react';
import { ChatRoom } from '../../types/interfaces';
import { GetServerSideProps } from 'next';
import Chat from '../../components/chat/chat';

interface ChatPageProps {
  room: ChatRoom;
}

export const getServerSideProps: GetServerSideProps = async (context) => {
  const roomId = context.params?.roomId;
  const response = await fetch(
    `${process.env.NEXT_PUBLIC_INTERNAL_API_URL}/chat/rooms/${roomId}`,
  );
  if (response.status == 404) return { notFound: true };
  const room: ChatRoom = await response.json();
  return { props: { room } };
};

const ChatPage: NextPage<ChatPageProps> = ({ room }) => {
  return (
    <>
      <Head>
        <title>{`Chat room «${room.name}»`}</title>
      </Head>

      <h1>Chat room «{room.name}»</h1>
      <Chat room={room} />
    </>
  );
};

export default ChatPage;
