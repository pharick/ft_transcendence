import React, { FC, useContext, useEffect, useState } from 'react';
import { io } from 'socket.io-client';
import ReadyGameBlock from './readyGameBlock';
import PendingGameBlock from './pendingGameBlock';
import {
  ChatRoomInvite,
  Game,
  Notifications,
  PendingGame,
  InviteFriends,
} from '../../types/interfaces';
import { UserContext } from '../users/userProvider';
import styles from '../../styles/Notifications.module.css';
import ChatRoomInviteBlock from './chatRoomInviteBlock';
import FriendInviteBlock from './friendInviteBlock';

const Notifications: FC = () => {
  const [isConnected, setIsConnected] = useState(false);
  const [games, setGames] = useState<Game[]>([]);
  const [pendingGames, setPendingGames] = useState<PendingGame[]>([]);
  const [chatInvites, setChatInvites] = useState<ChatRoomInvite[]>([]);
  const [friendsInvites, setFriendsInvites] = useState<InviteFriends[]>([]);
  const userContext = useContext(UserContext);

  useEffect(() => {
    setGames([]);
    setPendingGames([]);

    const socket = io(
      `${
        process.env.NODE_ENV == 'development'
          ? process.env.NEXT_PUBLIC_INTERNAL_API_URL
          : ''
      }/notifications`,
      {
        auth: { token: localStorage.getItem('token') },
      },
    );

    socket.on('connect', () => {
      setIsConnected(true);
    });

    socket.on('disconnect', () => {
      setIsConnected(false);
      setGames([]);
      setPendingGames([]);
      setFriendsInvites([]);
    });

    socket.on('notifications', (notifications: Notifications) => {
      console.log(notifications);
      setGames(notifications.games);
      setPendingGames(notifications.pending);
      setChatInvites(notifications.chatInvites);
      setFriendsInvites(notifications.friendsInvites);
    });

    return () => {
      socket.off('connect');
      socket.off('disconnect');
      socket.off('newMessages');
      socket.disconnect();
    };
  }, [userContext.user?.id]);

  if (isConnected) {
    return (
      <>
        <h2>Notifications</h2>

        {games.length > 0 ||
        pendingGames.length > 0 ||
        chatInvites.length > 0 ||
        friendsInvites.length > 0 ? (
          <ul className={styles.list}>
            {games.map((game) => (
              <li key={`game-${game.id}`}>
                <ReadyGameBlock game={game} />
              </li>
            ))}

            {pendingGames.map((game) => (
              <li key={`pending-${game.id}`}>
                <PendingGameBlock game={game} />
              </li>
            ))}

            {chatInvites.map((invite) => (
              <li key={`chatInvite-${invite.id}`}>
                <ChatRoomInviteBlock invite={invite} />
              </li>
            ))}

            {friendsInvites.map((invite) => (
              <li key={`friendInvite-${invite.id}`}>
                <FriendInviteBlock invite={invite} />
              </li>
            ))}
          </ul>
        ) : (
          <p>You don't have any notifications</p>
        )}
      </>
    );
  } else {
    return (
      <section>
        <div className="loader"></div>
        <p className="loader-message">Load notifications...</p>
      </section>
    );
  }
};

export default Notifications;
