import type { NextPage } from 'next';
import Head from 'next/head';
import React from 'react';
import { ChatRoom } from '../../../types/interfaces';
import { GetServerSideProps } from 'next';
import Chat from '../../../components/chat/chat';

interface DirectPageProps {
  room: ChatRoom;
}

export const getServerSideProps: GetServerSideProps = async (context) => {
  const userId = context.params?.userId;
  const response = await fetch(
    `${process.env.NEXT_PUBLIC_INTERNAL_API_URL}/chat/rooms/directs/${userId}`,
  );
  if (response.status == 404) return { notFound: true };
  const room: ChatRoom = await response.json();
  return { props: { room } };
};

const DirectPage: NextPage<DirectPageProps> = ({ room }) => {
  return (
    <>
      <Head>
        <title>{`Direct messages ${room.name}`}</title>
      </Head>

      <h1>Direct messages {room.name}</h1>
      <Chat room={room} />
    </>
  );
};

export default DirectPage;
