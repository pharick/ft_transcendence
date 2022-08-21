import type { NextPage } from 'next';
import Head from 'next/head';
import ChatRooms from '../../components/chat/chatRooms';
import React from 'react';

const ChatRoomsPage: NextPage = () => {
  return (
    <>
      <Head>
        <title>Chat rooms</title>
      </Head>

      <h1>Chat Rooms</h1>
      <ChatRooms />
    </>
  );
};

export default ChatRoomsPage;
