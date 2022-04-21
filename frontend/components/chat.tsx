import { FC, FormEvent, useEffect, useRef, useState } from 'react';
import { io, Socket } from "socket.io-client";

const Chat: FC = () => {
  const socket = useRef<Socket | null>(null);
  const [messages, setMessages] = useState<Array<string>>([]);
  const [newMessage, setNewMessage] = useState<string>('');

  useEffect(() => {
    if (socket.current)
      return;
    socket.current = io('/api');
    socket.current?.on('msgToClient', (message) => {
      console.log(message);
      setMessages((messages) => [...messages, message]);
    });
  }, []);

  const sendMessage = (e: FormEvent) => {
    e.preventDefault();
    if (newMessage.length > 0) {
      socket.current?.emit('msgToServer', newMessage);
      setNewMessage('');
    }
  }

  return (
    <>
      <h1>Chat</h1>
      <ul>
        {messages.map((message: string) => (
          <li>{message}</li>
        ))}
      </ul>

      <form onSubmit={sendMessage}>
        <input
          type='text'
          value={newMessage}
          onChange={(e) => {setNewMessage(e.target.value)}}
        />
      </form>
    </>
  );
};

export default Chat;
