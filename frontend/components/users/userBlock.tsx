import { FC, useContext } from 'react';
import { UserContext } from './userProvider';

const UserBlock: FC = () => {
  const INTRA_AUTH_API_URL = 'https://api.intra.42.fr/oauth/authorize';

  const userContext = useContext(UserContext);

  return (
    <section className="user-block">
      {userContext.user ? (
        <>
          <p className="user-name">{userContext.user.username}</p>
          <button onClick={userContext.handleLogout}>Logout</button>
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
