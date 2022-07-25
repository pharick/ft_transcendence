import { FC } from 'react';
import { UserInfo } from '../../types/interfaces';

interface PlayerBlockProps {
  user?: UserInfo;
}

const PlayerBlock: FC<PlayerBlockProps> = ({ user }) => {
  return (
    <article>
      <div className='avatar-placeholder-big'></div>
      <p className='player-block-username'>
        {user ? `${user.username} (Rank: ${user.rank})` : 'Mr. Wall'}
      </p>
    </article>
  );
};

export default PlayerBlock;
