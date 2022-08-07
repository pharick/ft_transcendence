import { FC, useContext } from 'react';
import { User } from '../../types/interfaces';
import Image from 'next/image';
import { UserContext } from './userProvider';

interface UserBlockProps {
  user: User;
}

const UserBlock: FC<UserBlockProps> = ({ user }) => {
  const userContext = useContext(UserContext);
  const defaultAvatarUrl = 'static/avatars/default.png';

  let username = user.username;
  if (userContext.user?.id == user.id) username += ' (you)';

  return (
    <article className="user-block">
      <div className="user-block-avatar">
        <Image
          src={`${process.env.NEXT_PUBLIC_INTERNAL_API_URL}/${
            user?.avatar || defaultAvatarUrl
          }`}
          width={250}
          height={250}
          alt={user ? `${username}` : 'Mr. Wall'}
        />
        {user && <p className="user-block-rank">{user.rank}</p>}
      </div>
      <p className="user-block-username">{user ? `${username}` : 'Mr. Wall'}</p>
    </article>
  );
};

export default UserBlock;
