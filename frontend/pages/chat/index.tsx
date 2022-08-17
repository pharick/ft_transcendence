import type { NextPage } from 'next';
import Head from 'next/head';
import ChatRooms from '../../components/chat/chatRooms';
import React from 'react';

const ChatPage: NextPage = () => {
  return (
    <>
      <Head>
        <title>Chat</title>
      </Head>

      <h1>Chat</h1>

      <div className="row">
        <div className="col-md-6 col-lg-5 col-xl-3">
          <ChatRooms />
        </div>
        <div className="col"></div>
      </div>
    </>
  );
};

export default ChatPage;
