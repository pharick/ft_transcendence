import React, { FC, useContext, useEffect, useState } from 'react';
import Link from 'next/link';
import { SubmitHandler, useForm } from 'react-hook-form';
import { fetchWithHandleErrors } from '../../utils';
import { RequestErrorHandlerContext } from '../utils/requestErrorHandlerProvider';
import { CreateChatRoomDto } from '../../types/dtos';
import { ChatRoom, ChatRoomType } from '../../types/interfaces';
import { UserContext } from '../users/userProvider';
import styles from '../../styles/ChatRooms.module.css';
import Image from 'next/image';
import publicRoom from '../../images/public.svg';
import privateRoom from '../../images/private.svg';
import protectedRoom from '../../images/protected.svg';

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
      authRequired: true,
    });
    createRoomForm.reset();
  };

  useEffect(() => {
    const loadRooms = async () => {
      const response = await fetchWithHandleErrors({
        requestErrorHandlerContext,
        url: '/api/chat/rooms',
        authRequired: true,
      });
      if (!response.ok) return;
      const rooms: ChatRoom[] = await response.json();
      setRooms(rooms);
    };
    loadRooms().then();
  }, []);

  return (
    <section>
      <ul className={`${styles.list} row`}>
        {rooms.map((room) => (
          <li key={room.id} className="col-md-6">
            <Link href={`/chat/${room.id}`}>
              <a className={styles.link}>
                <article className={styles.block}>
                  <Image
                    src={
                      room.type == ChatRoomType.Public
                        ? publicRoom
                        : room.type == ChatRoomType.Private
                        ? privateRoom
                        : protectedRoom
                    }
                    width={30}
                    height={30}
                  />
                  <p className={styles.name}>
                    {room.name}
                    {room.users
                      .filter((user) => user.isAdmin)
                      .map((user) => user.user.id)
                      .includes(userContext.user?.id) && ' (you are admin)'}
                  </p>
                </article>
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
