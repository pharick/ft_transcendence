import React, { FC, useContext, useEffect, useState } from 'react';
import Link from 'next/link';
import { SubmitHandler, useForm } from 'react-hook-form';
import { fetchWithHandleErrors } from '../../utils';
import { RequestErrorHandlerContext } from '../utils/requestErrorHandlerProvider';
import { ChatRoomType, CreateChatRoomDto } from '../../types/dtos';
import { ChatRoom } from '../../types/interfaces';
import { UserContext } from '../users/userProvider';
import styles from '../../styles/ChatRooms.module.css';

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
      console.log(rooms);
      setRooms(rooms);
    };
    loadRooms().then();
  }, []);

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
            <div className="col-2">
              <select
                className="w-100 m-0"
                {...createRoomForm.register('type')}
              >
                {Object.keys(ChatRoomType)
                  .filter((key) => isNaN(Number(key)))
                  .map((key) => (
                    <option key={key} value={Object(ChatRoomType)[key]}>
                      {key}
                    </option>
                  ))}
              </select>
            </div>
            <div className="col-2">
              <input
                type="text"
                className="w-100"
                placeholder="Password"
                disabled={
                  createRoomForm.getValues('type') != ChatRoomType.Protected
                }
                {...createRoomForm.register('password', {
                  maxLength: 15,
                })}
              />
            </div>
            <div className="col-auto">
              <button className="w-100" type="submit">
                Create
              </button>
            </div>
          </div>
        </form>
      )}
    </section>
  );
};

export default ChatRooms;
