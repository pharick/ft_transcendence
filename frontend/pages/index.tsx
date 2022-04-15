import type { NextPage } from 'next';
import dynamic from 'next/dynamic'

const Pong = dynamic(() => import('../components/pong'), { ssr: false });


const Home: NextPage = () => {
  return (
    <Pong />
  );
};

export default Home;
