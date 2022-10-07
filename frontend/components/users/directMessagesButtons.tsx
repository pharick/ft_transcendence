import { FC, useContext, useEffect, useState } from 'react';
import Image from 'next/image';
import direct from '../../images/direct.svg';
import Link from 'next/link';
import { Direct, User } from '../../types/interfaces';
import { RequestErrorHandlerContext } from '../utils/requestErrorHandlerProvider';
import { fetchWithHandleErrors } from '../../utils';
import { CreateDirectDto } from '../../types/dtos';

interface DirectMessagesButtonProps {
  user: User;
}

const DirectMessagesButtons: FC<DirectMessagesButtonProps> = ({ user }) => {
  const requestErrorHandlerContext = useContext(RequestErrorHandlerContext);
  const [blocked, setBlocked] = useState<boolean>();
  const [roomId, setRoomId] = useState<number>();

  useEffect(() => {
    const getRoom = async () => {
      let response = await fetchWithHandleErrors({
        requestErrorHandlerContext,
        url: `/api/chat/rooms/directs/${user.id}`,
        ignoreCodes: [404],
      });
      if (response.status == 404) {
        const createDirectDto: CreateDirectDto = {
          userId: user.id,
        };
        response = await fetchWithHandleErrors({
          requestErrorHandlerContext,
          url: '/api/chat/rooms/directs',
          method: 'PUT',
          body: createDirectDto,
          ignoreCodes: [409],
        });
      }
      if (!response.ok) return;
      const direct: Direct = await response.json();
      if (!direct) return;
      setRoomId(direct.chatRoom.id);
      setBlocked(
        (user.id == direct.user1.id && direct.user1Blocked) ||
          (user.id == direct.user2.id && direct.user2Blocked),
      );
    };
    getRoom().then();
  }, []);

  const handleBlock = async () => {
    const response = await fetchWithHandleErrors({
      requestErrorHandlerContext,
      url: `/api/chat/rooms/directs/${user.id}/block`,
      method: 'POST',
      authRequired: true,
    });
    if (response.ok) setBlocked(true);
  };

  const handleUnblock = async () => {
    const response = await fetchWithHandleErrors({
      requestErrorHandlerContext,
      url: `/api/chat/rooms/directs/${user.id}/unblock`,
      method: 'POST',
      authRequired: true,
    });
    if (response.ok) setBlocked(false);
  };

  if (roomId) {
    return (
      <>
        <li>
          <Link href={`/chat/${roomId}`}>
            <a className="button icon-button w-100 d-flex justify-content-center">
              <Image
                src={direct}
                alt="Direct messages"
                width={25}
                height={25}
              />{' '}
              Direct messages
            </a>
          </Link>
        </li>
        <li>
          <button
            className={`${
              blocked ? 'success-button' : 'error-button'
            } w-100 d-flex justify-content-center`}
            onClick={() => {
              blocked ? handleUnblock() : handleBlock();
            }}
          >
            {blocked
              ? 'Unblock messages from user'
              : 'Block messages from user'}
          </button>
        </li>
      </>
    );
  } else {
    return <></>;
  }
};

export default DirectMessagesButtons;
