import { FC } from 'react';
import { User } from '../../types/interfaces';
import Image from 'next/image';

interface UserBlockProps {
  user: User;
}

const UserBlock: FC<UserBlockProps> = ({ user }) => {
  const defaultAvatarUrl = 'static/avatars/default.png';
  return (
    <article className="user-block">
      <div className="user-block-avatar">
        <Image
          src={`${process.env.NEXT_PUBLIC_INTERNAL_API_URL}/${
            user?.avatar || defaultAvatarUrl
          }`}
          width={250}
          height={250}
          alt={user ? `${user.username}` : 'Mr. Wall'}
        />
        {user && <p className="user-block-rank">{user.rank}</p>}
      </div>
      <p className="user-block-username">
        {user ? `${user.username}` : 'Mr. Wall'}
      </p>
    </article>
  );
};

export default UserBlock;
