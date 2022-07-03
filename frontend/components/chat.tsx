import { FC, FormEvent, useEffect, useRef, useState } from 'react';
import { io, Socket } from 'socket.io-client';

const Chat: FC = () => {
  const socket = useRef<Socket>();
  const [messageText, setMessageText] = useState('');
  const [messages, setMessages] = useState<string[]>([]);

  useEffect(() => {
    if (socket.current && socket.current?.active) return;

    socket.current = io(
      `${
        process.env.NODE_ENV == 'development'
          ? process.env.NEXT_PUBLIC_INTERNAL_API_URL
          : ''
      }/chat`,
    );
    socket.current?.connect();

    socket.current?.on('msgToClient', (message: string) => {
      setMessages((oldMessages) => [...oldMessages, message]);
    })
  });

  const handleMessageSubmit = (event: FormEvent) => {
    event.preventDefault();
    if (!messageText) return;
    socket.current?.emit('msgToServer', messageText);
    setMessageText('');
  };

  const handleMessageChange = (message: string) => {
    setMessageText(message);
  };

  return (
    <>
      <h1>Chat</h1>

      <ul>
        {messages.map((message) => (
          <li key={message}>{message}</li>
        ))}
      </ul>

      <form onSubmit={handleMessageSubmit}>
        <input type="text" value={messageText} onChange={(event) => {handleMessageChange(event.target.value)}} />
        <button type="submit">Send</button>
      </form>
    </>
  );
}

export default Chat;
