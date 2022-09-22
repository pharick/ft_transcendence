import React, { FC, useContext, useEffect, useRef, useState } from 'react';
import { ChatMessage, ChatRoom, ChatRoomUser } from '../../types/interfaces';
import { io, Socket } from 'socket.io-client';
import { utcToZonedTime } from 'date-fns-tz';
import { format } from 'date-fns';
import { UserContext } from '../users/userProvider';
import { SubmitHandler, useForm } from 'react-hook-form';
import { ChatMessageDto, ChatRoomPasswordDto } from '../../types/dtos';
import RoomUserList from './roomUserList';
import dynamic from 'next/dynamic';
import { useRouter } from 'next/router';
import styles from '../../styles/Chat.module.css';
import InviteChatUserButton from './inviteChatUserButton';

const Modal = dynamic(() => import('../../components/layout/modal'), {
  ssr: false,
});

interface ChatProps {
  room: ChatRoom;
}

const Chat: FC<ChatProps> = ({ room }) => {
  const [socket, setSocket] = useState<Socket>();
  const [forbiddenText, setForbiddenText] = useState<string>(null);
  const [mutedText, setMutedText] = useState<string>(null);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [roomUsers, setRoomUsers] = useState<ChatRoomUser[]>([]);
  const [passwordRequired, setPasswordRequired] = useState(false);
  const [currentUser, setCurrentUser] = useState<ChatRoomUser>();
  const userContext = useContext(UserContext);
  const roomPasswordForm = useForm<ChatRoomPasswordDto>();
  const newMessageForm = useForm<ChatMessageDto>();
  const messageList = useRef<HTMLUListElement>(null);
  const router = useRouter();

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

    socket.on('sendClients', (clients: ChatRoomUser[]) => {
      setRoomUsers(clients);
      const me = clients.find(
        (client) => client.user.id == userContext.user?.id,
      );
      if (me) setCurrentUser(me);
    });

    socket.on('initMessages', (messages: ChatMessage[]) => {
      setMessages(messages);
    });

    socket.on('messageToClient', (message: ChatMessage) => {
      setMessages((messages) => [...messages, message]);
    });

    socket.on('forbidden', (text: string) => {
      setForbiddenText(text);
    });

    socket.on('passwordRequired', () => {
      setPasswordRequired(true);
    });

    socket.on('muted', (text: string) => {
      setMutedText(text);
    });

    setSocket(socket);

    return () => {
      socket.off('sendClients');
      socket.off('initMessages');
      socket.off('messageToClient');
      socket.disconnect();
    };
  }, [userContext.user?.id]);

  useEffect(() => {
    if (messageList.current)
      messageList.current.scrollTop = messageList.current.scrollHeight;
  }, [messages]);

  const enterPassword: SubmitHandler<ChatRoomPasswordDto> = (data) => {
    socket.emit('enterPassword', data);
    roomPasswordForm.reset();
    setPasswordRequired(false);
  };

  const sendMessage: SubmitHandler<ChatMessageDto> = (data) => {
    socket.emit('messageToServer', data);
    newMessageForm.reset();
  };

  const successfulInviteHandler = (invitedUser: ChatRoomUser) => {
    const data: ChatMessageDto = {
      roomId: room.id,
      text: `I invite ${invitedUser.user.username} to play pong!`,
    };
    socket.emit('messageToServer', data);
  };

  if (forbiddenText) {
    return <p>{forbiddenText}</p>;
  }

  return (
    <section>
      <div className="row">
        <div className="col-md">
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

          <form
            className="d-flex"
            onSubmit={newMessageForm.handleSubmit(sendMessage)}
          >
            <input
              type="hidden"
              value={room.id}
              {...newMessageForm.register('roomId', { required: true })}
            />
            <input
              className="flex-grow-1"
              type="text"
              placeholder={mutedText || 'New message'}
              {...newMessageForm.register('text', { required: true })}
            />

            <button type="submit">Send</button>
          </form>
        </div>
        <div className="col-md-3">
          <InviteChatUserButton room={room} />
          <RoomUserList
            roomUsers={roomUsers}
            currentUser={currentUser}
            successfulInviteHandler={successfulInviteHandler}
          />
        </div>
      </div>

      <Modal
        isOpen={passwordRequired}
        title="Enter protected room password"
        cancelButtonText="Cancel"
        cancelButtonHandler={() => {
          router.push('/chat').then();
        }}
      >
        <form
          className="d-flex"
          onSubmit={roomPasswordForm.handleSubmit(enterPassword)}
        >
          <input
            className="flex-grow-1"
            type="password"
            {...roomPasswordForm.register('password')}
          />
          <button type="submit">Enter</button>
        </form>
      </Modal>
    </section>
  );
};

export default Chat;
