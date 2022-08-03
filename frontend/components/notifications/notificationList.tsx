import React, { FC, useCallback, useContext, useEffect, useState } from 'react';
import Link from 'next/link';
import { io } from 'socket.io-client';
import ReadyGameBlock from './readyGameBlock';
import InviteGameBlock from './inviteGameBlock';
import WaitGameBlock from './waitGameBlock';
import { UserContext } from '../users/userProvider';
import { fetchWithHandleErrors } from '../../utils';
import { RequestErrorHandlerContext } from '../utils/requestErrorHandlerProvider';

const NotificationList: FC = () => {
  const [isConnected, setIsConnected] = useState(false);
  const userContext = useContext(UserContext);

  useEffect(() => {
    const socket = io(
      `${
        process.env.NODE_ENV == 'development'
          ? process.env.NEXT_PUBLIC_INTERNAL_API_URL
          : ''
      }/notifications`,
      {
        autoConnect: false,
        auth: { userId: userContext.user?.id },
      },
    );

    socket.connect();

    socket.on('connect', () => {
      setIsConnected(true);
      socket.emit('introduce', userContext.user?.id);
    });

    return () => {
      socket.off('connect');
      socket.off('update');
      socket.disconnect();
    };
  }, [userContext.user]);

  if (isConnected) {
    return (
      <section>
        {/*{hostGames.length > 0 ||*/}
        {/*guestGames.length > 0 ||*/}
        {/*currentGames.length > 0 ? (*/}
        {/*  <ul className="notification-list">*/}
        {/*    {currentGames.map((game) => (*/}
        {/*      <li key={game.gameId}>*/}
        {/*        <ReadyGameBlock game={game} />*/}
        {/*      </li>*/}
        {/*    ))}*/}

        {/*    {guestGames.map((game) => (*/}
        {/*      <li key={game.id}>*/}
        {/*        <InviteGameBlock game={game} />*/}
        {/*      </li>*/}
        {/*    ))}*/}

        {/*    {hostGames.map((game) => (*/}
        {/*      <li key={game.id}>*/}
        {/*        <WaitGameBlock game={game} />*/}
        {/*      </li>*/}
        {/*    ))}*/}
        {/*  </ul>*/}
        {/*) : (*/}
        {/*  <>*/}
        {/*    <p>*/}
        {/*      You don&apos;t have any invitations to the game, take the first*/}
        {/*      step 😉*/}
        {/*    </p>*/}
        {/*    <ul>*/}
        {/*      <li>*/}
        {/*        <Link href="/users">*/}
        {/*          <a>Invite someone</a>*/}
        {/*        </Link>*/}
        {/*      </li>*/}
        {/*    </ul>*/}
        {/*  </>*/}
        {/*)}*/}
      </section>
    );
  } else {
    return (
      <>
        <div className="loader"></div>
        <p className="load-message">Load notifications...</p>
      </>
    );
  }
};

export default NotificationList;
