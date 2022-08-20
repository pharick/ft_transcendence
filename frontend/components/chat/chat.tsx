import { FC, useContext, useEffect, useRef, useState } from 'react';
import { ChatMessage, ChatRoom } from '../../types/interfaces';
import { io, Socket } from 'socket.io-client';
import { utcToZonedTime } from 'date-fns-tz';
import { format } from 'date-fns';

import styles from '../../styles/Chat.module.css';
import { UserContext } from '../users/userProvider';

interface ChatProps {
  room: ChatRoom;
}

const Chat: FC<ChatProps> = ({ room }) => {
  const [socket, setSocket] = useState<Socket>();
  const messageList = useRef<HTMLUListElement>(null);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const userContext = useContext(UserContext);

  useEffect(() => {
    const socket = io(
      `${
        process.env.NODE_ENV == 'development'
          ? process.env.NEXT_PUBLIC_INTERNAL_API_URL
          : ''
      }/chat`,
      {
        auth: { token: localStorage.getItem('token'), roomId: room.id },
      },
    );

    setSocket(socket);

    return () => {
      socket.disconnect();
    };
  }, []);

  return (
    <section>
      <ul className={styles.chatList} ref={messageList}>
        {messages.map((message) => (
          <li
            key={message.id}
            className={
              message.user.id == userContext.user?.id
                ? styles.chatMessageMy
                : ''
            }
          >
            <article className={styles.chatMessage}>
              <p className={styles.chatMessageText}>{message.text}</p>
              <footer className={styles.chatMessageFooter}>
                <p className={styles.chatMessageUser}>
                  {message.user.username}
                </p>
                <p className={styles.chatMessageDate}>
                  {format(
                    utcToZonedTime(message.date, 'Europe/Moscow'),
                    'dd.MM.yyyy H:mm:ss',
                  )}
                </p>
              </footer>
            </article>
          </li>
        ))}
      </ul>

      {userContext.user ? (
        <form className="d-flex">
          <input
            className="flex-grow-1"
            type="text"
            placeholder="New message"
          />
          <button type="submit">Send</button>
        </form>
      ) : (
        <p className="warning-message">Please login to send messages</p>
      )}
    </section>
  );
};

export default Chat;
