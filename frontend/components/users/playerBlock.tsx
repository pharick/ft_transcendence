import { FC } from 'react';
import { UserInfo } from '../../types/interfaces';

interface PlayerBlockProps {
  user?: UserInfo;
}

const PlayerBlock: FC<PlayerBlockProps> = ({ user }) => {
  const avatarUrl =`/api/users/${user?.id}/avatar`;

  return (
    <article>
      <div className='avatar-placeholder-big'>
        <picture>
            <img src={avatarUrl} alt='Users avatar'/>
          </picture>
      </div>
      <p className='player-block-username'>
        {user ? `${user.username} (Rank: ${user.rank})` : 'Mr. Wall'}
      </p>
    </article>
  );
};

export default PlayerBlock;
