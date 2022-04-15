import type { NextPage } from 'next';
import dynamic from 'next/dynamic'
import Chat from "../components/chat";

const Pong = dynamic(() => import('../components/pong'), { ssr: false });


const Home: NextPage = () => {
  return (
    <>
      <Pong />
      <Chat />
    </>
  );
};

export default Home;
