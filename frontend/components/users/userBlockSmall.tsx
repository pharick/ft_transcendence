import React, { FC, useContext } from 'react';
import { User } from '../../types/interfaces';
import Image from 'next/image';
import { UserContext } from './userProvider';

interface UserBlockSmallProps {
  user: User;
}

const UserBlockSmall: FC<UserBlockSmallProps> = ({ user }) => {
  const userContext = useContext(UserContext);
  const defaultAvatarUrl = 'static/avatars/default.png';

  let username = user?.username || 'Mr. Wall';
  if (userContext.user?.id == user?.id) username += ' (you)';

  return (
    <article className="user-block-small">
      <div className="user-block-small-avatar">
        <Image
          src={`${process.env.NEXT_PUBLIC_INTERNAL_API_URL}/${
            user?.avatar || defaultAvatarUrl
          }`}
          width={50}
          height={50}
          alt={user ? `${username}` : 'Mr. Wall'}
        />
      </div>
      <p className="user-block-small-username">
        {user ? `${username}` : 'Mr. Wall'}
      </p>
    </article>
  );
};

export default UserBlockSmall;
