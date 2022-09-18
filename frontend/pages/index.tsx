import type { NextPage } from 'next';
import Head from 'next/head';

import MatchMakingButton from '../components/games/matchMakingButton';
import TrainingGameButton from '../components/games/trainingGameButton';
import Notifications from '../components/notifications/notifications';
import Link from 'next/link';
import Image from 'next/image';
import pongImage from '../images/pingpong.svg';
import styles from '../styles/Notifications.module.css';
import TableTopTen from '../components/notifications/tableTopTen';
import React from 'react';

const HomePage: NextPage = () => {
  return (
    <>
      <Head>
        <title>Main page</title>
      </Head>

      <section className="d-flex gap-3 justify-content-center mb-4">
        <div>
          <TrainingGameButton />
        </div>
        <div>
          <MatchMakingButton />
        </div>
        <div>
          <Link href="/users">
            <a className="image-button">
              <Image src={pongImage} width={100} height={100} />
              <span>Invite someone to play</span>
            </a>
          </Link>
        </div>
      </section>

      <section className={`row flex-grow-1 ${styles.notifications}`}>
        <div className={`col-md ${styles.section}`}>
          <Notifications />
        </div>

        <div className={`col-md ${styles.section}`}>
          <h2>Top-10 leadership board</h2>
          <TableTopTen />
        </div>
      </section>
    </>
  );
};

export default HomePage;
