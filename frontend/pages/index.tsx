import type { NextPage } from 'next';
import Head from 'next/head';

import MatchMakingButton from '../components/games/matchMakingButton';
import TrainingGameButton from '../components/games/trainingGameButton';
import Notifications from '../components/notifications/notifications';
import Link from 'next/link';
import Image from 'next/image';
import pongImage from '../images/pingpong.svg';

const HomePage: NextPage = () => {
  return (
    <>
      <Head>
        <title>Main page</title>
      </Head>

      <section className="row justify-content-center mb-4">
        <div className="col-auto">
          <TrainingGameButton />
        </div>
        <div className="col-auto">
          <MatchMakingButton />
        </div>
        <div className="col-auto">
          <Link href="/users">
            <a className="image-button">
              <Image src={pongImage} width={100} height={100} />
              <span>Invite someone to play</span>
            </a>
          </Link>
        </div>
      </section>

      <Notifications />
    </>
  );
};

export default HomePage;
