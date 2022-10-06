import { FC, useContext, useEffect, useState } from 'react';
import Image from 'next/image';
import direct from '../../images/direct.svg';
import Link from 'next/link';
import { User } from '../../types/interfaces';
import { RequestErrorHandlerContext } from '../utils/requestErrorHandlerProvider';
import { fetchWithHandleErrors } from '../../utils';
import { CreateDirectDto } from '../../types/dtos';

interface DirectMessagesButtonProps {
  user: User;
}

const DirectMessagesButton: FC<DirectMessagesButtonProps> = ({ user }) => {
  const requestErrorHandlerContext = useContext(RequestErrorHandlerContext);
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
      const room = await response.json();
      setRoomId(room.id);
    };
    getRoom().then();
  }, []);

  if (roomId) {
    return (
      <Link href={`/chat/${roomId}`}>
        <a className="button icon-button w-100 d-flex justify-content-center">
          <Image src={direct} alt="Direct messages" width={25} height={25} />{' '}
          Direct messages
        </a>
      </Link>
    );
  } else {
    return <></>;
  }
};

export default DirectMessagesButton;
