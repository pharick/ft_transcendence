import { FC } from 'react';
import { UserInfo } from '../../types/interfaces';
import Image from 'next/image'

interface PlayerBlockProps {
  user?: UserInfo;
}

const PlayerBlock: FC<PlayerBlockProps> = ({ user }) => {
  const defaultAvatar = 'static/avatars/default_avatar.png'
  const avatarImage = `${user?.avatar ? user?.avatar : defaultAvatar}`
  const avatarUrl =`api/${avatarImage}`;

  const avatarLoader = ({src, width, quality}: any) => {
    return `http://localhost/${src}`
  }

  return (
    <article>
      <div className='avatar-placeholder-big'>
        <Image
          layout='raw'
          loader={avatarLoader}
          src={avatarUrl}
          alt='Users avatar'
        />
      </div>
      <p className='player-block-username'>
        {user ? `${user.username} (Rank: ${user.rank})` : 'Mr. Wall'}
      </p>
    </article>
  );
};

export default PlayerBlock;
