import { FC, FormEvent, useCallback, useEffect, useRef, useState } from 'react';
import { io, Socket } from 'socket.io-client';
import { ChatMessage, ChatRoom, UserInfo } from '../types/interfaces';
import { format } from 'date-fns';
import { utcToZonedTime } from 'date-fns-tz';
import { ChatMessageDto } from '../types/dtos';

interface ChatProps {
  user?: UserInfo;
  userSessionId?: string;
  room?: ChatRoom;
}

const Chat: FC<ChatProps> = ({ user, userSessionId, room }) => {
  const socket = useRef<Socket>();
  const messageList = useRef<HTMLUListElement>(null);
  const [messageText, setMessageText] = useState('');
  const [messages, setMessages] = useState<ChatMessage[]>([]);

  const getMessages = useCallback(async () => {
    let roomPostfix = 'common';
    if (room?.isPrivate && user) {
      const companion = user.id == room.hostUser.id ? room.guestUser : room.hostUser;
      roomPostfix = `private/${companion.id}`;
    }

    const messagesResponse = await fetch(`/api/chat/messages/${roomPostfix}`);
    const messages = await messagesResponse.json();
    setMessages(messages);
  }, [user, room]);

  useEffect(() => {
    getMessages().then();

    socket.current = io(
      `${
        process.env.NODE_ENV == 'development'
          ? process.env.NEXT_PUBLIC_INTERNAL_API_URL
          : ''
      }/chat`,
    );
    socket.current?.connect();
    socket.current?.emit('connectToRoom', room);

    socket.current?.on('msgToClient', (message: ChatMessage) => {
      setMessages((oldMessages) => [...oldMessages, message]);
    });
  }, [getMessages, room]);

  useEffect(() => {
    if (messageList.current)
      messageList.current.scrollTop = messageList.current.scrollHeight;
  }, [messages]);

  const handleMessageSubmit = (event: FormEvent) => {
    event.preventDefault();
    if (!messageText) return;
    const message: ChatMessageDto = {
      sessionId: userSessionId,
      roomId: room?.id,
      text: messageText,
    }
    socket.current?.emit('msgToServer', message);
    setMessageText('');
  };

  const handleMessageChange = (message: string) => {
    setMessageText(message);
  };

  return (
    <>
      <h1>
        {room
          ? <>
            Private chat with <b>{user?.id == room.hostUser.id ? room.guestUser.username : room.hostUser.username}</b>
          </>
          : 'Common chat'
        }
      </h1>

      <section className='chat'>
        <ul className='chat-list' ref={messageList}>
          {messages.map((message) => (
            <li key={message.id} className={message.user.id == user?.id ? 'chat-message-my' : ''}>
              <article className='chat-message'>
                <p className='chat-message-text'>{message.text}</p>
                <footer className='chat-message-footer'>
                  <p className='chat-message-user'>{message.user.username}</p>
                  <p className='chat-message-date'>
                    {format(utcToZonedTime(message.date, 'Europe/Moscow'), 'dd.MM.yyyy H:mm:ss')}
                  </p>
                </footer>
              </article>
            </li>
          ))}
        </ul>

        <form className='chat-form' onSubmit={handleMessageSubmit}>
          {user
            ?
            <>
              <input className='chat-form-input' type='text' placeholder='New message' value={messageText}
                     onChange={(event) => {
                       handleMessageChange(event.target.value);
                     }} />
              <button type='submit'>Send</button>
            </>
            :
            <p className='warning-message'>Please login to send messages</p>
          }
        </form>
      </section>
    </>
  );
};

export default Chat;
