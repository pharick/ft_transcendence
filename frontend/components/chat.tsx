import { FC, FormEvent, useCallback, useEffect, useRef, useState } from 'react';
import { io, Socket } from 'socket.io-client';
import { ChatMessage, UserInfo } from '../types/interfaces';
import { format } from 'date-fns';
import { utcToZonedTime } from 'date-fns-tz';

interface ChatProps {
  user: UserInfo | undefined;
  userSessionId: string | undefined;
}

const Chat: FC<ChatProps> = ({ user, userSessionId }) => {
  const socket = useRef<Socket>();
  const [messageText, setMessageText] = useState('');
  const [messages, setMessages] = useState<ChatMessage[]>([]);

  const getMessages = useCallback(async () => {
    const messagesResponse = await fetch('/api/chat/messages/common');
    const messages = await messagesResponse.json();
    setMessages(messages);
  }, []);

  useEffect(() => {
    getMessages().then();

    if (socket.current && socket.current?.active) return;

    socket.current = io(
      `${
        process.env.NODE_ENV == 'development'
          ? process.env.NEXT_PUBLIC_INTERNAL_API_URL
          : ''
      }/chat`,
    );
    socket.current?.connect();

    socket.current?.on('msgToClient', (message: ChatMessage) => {
      setMessages((oldMessages) => [...oldMessages, message]);
    })
  }, [getMessages]);

  const handleMessageSubmit = (event: FormEvent) => {
    event.preventDefault();
    if (!messageText) return;
    socket.current?.emit('msgToServer', {sessionId: userSessionId, text: messageText});
    setMessageText('');
  };

  const handleMessageChange = (message: string) => {
    setMessageText(message);
  };

  return (
    <>
      <h1>Chat</h1>

      <section className="chat">
        <ul className="chat-list">
          {messages.map((message) => (
            <li key={message.id} className={message.user.id == user?.id ? 'chat-message-my' : ''}>
              <article className="chat-message">
                <p className="chat-message-text">{message.text}</p>
                <footer className="chat-message-footer">
                  <p className="chat-message-user">{message.user.username}</p>
                  <p className="chat-message-date">
                    {format(utcToZonedTime(message.date, 'Europe/Moscow'), 'dd.MM.yyyy h:mm:ss')}
                  </p>
                </footer>
              </article>
            </li>
          ))}
        </ul>

        <form className="chat-form" onSubmit={handleMessageSubmit}>
          <input className="chat-form-input" type="text" placeholder="New message" value={messageText} onChange={(event) => {handleMessageChange(event.target.value)}} />
          <button type="submit">Send</button>
        </form>
      </section>
    </>
  );
}

export default Chat;
