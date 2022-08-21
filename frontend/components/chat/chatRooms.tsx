import React, { FC, useContext, useEffect, useState } from 'react';
import { fetchWithHandleErrors } from '../../utils';
import { CreateChatRoomDto } from '../../types/dtos';
import { RequestErrorHandlerContext } from '../utils/requestErrorHandlerProvider';
import { SubmitHandler, useForm } from 'react-hook-form';
import { ChatRoom } from '../../types/interfaces';

import styles from '../../styles/ChatRooms.module.css';
import Link from 'next/link';
import { UserContext } from '../users/userProvider';

const ChatRooms: FC = () => {
  const requestErrorHandlerContext = useContext(RequestErrorHandlerContext);
  const userContext = useContext(UserContext);
  const createRoomForm = useForm<CreateChatRoomDto>();
  const [rooms, setRooms] = useState<ChatRoom[]>([]);

  const createRoom: SubmitHandler<CreateChatRoomDto> = async (data) => {
    await fetchWithHandleErrors({
      requestErrorHandlerContext,
      url: '/api/chat/rooms',
      method: 'PUT',
      body: data,
    });
    createRoomForm.reset();
  };

  useEffect(() => {
    const loadRooms = async () => {
      const response = await fetchWithHandleErrors({
        requestErrorHandlerContext,
        url: '/api/chat/rooms',
      });
      const rooms: ChatRoom[] = await response.json();
      setRooms(rooms);
    };
    loadRooms().then();
  });

  return (
    <section>
      <ul className={styles.list}>
        {rooms.map((room) => (
          <li key={room.id}>
            <Link href={`/chat/${room.id}`}>
              <a className={styles.link}>
                <article className={styles.block}>{room.name}</article>
              </a>
            </Link>
          </li>
        ))}
      </ul>

      {userContext.user && (
        <form onSubmit={createRoomForm.handleSubmit(createRoom)}>
          <div className="row align-items-center">
            <div className="col">
              <input
                type="text"
                className="w-100"
                placeholder="New room"
                {...createRoomForm.register('name', {
                  required: true,
                  minLength: 3,
                  maxLength: 15,
                })}
              />
            </div>
            <div className="col-auto">
              <button type="submit">Create</button>
            </div>
          </div>
        </form>
      )}
    </section>
  );
};

export default ChatRooms;
