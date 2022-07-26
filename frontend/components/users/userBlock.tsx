import { FC } from 'react';
import { UserInfo } from '../../types/interfaces';

interface UserBlockProps {
  user?: UserInfo;
  handleLogout?: () => void;
}

const UserBlock: FC<UserBlockProps> = ({ user, handleLogout }) => {
  const INTRA_AUTH_API_URL = 'https://api.intra.42.fr/oauth/authorize';

  return (
    <section className="user-block">
      {user ? (
        <>
          <p className="user-name">{user.username}</p>
          <button onClick={handleLogout}>Logout</button>
        </>
      ) : (
        <a
          className="button"
          href={`${INTRA_AUTH_API_URL}?client_id=${process.env.NEXT_PUBLIC_INTRA_CLIENT_ID}&redirect_uri=${encodeURI(process.env.NEXT_PUBLIC_INTRA_REDIRECT_URL!)}&response_type=code`}
        >
          Login via 42
        </a>
      )}
    </section>
  );
};

export default UserBlock;