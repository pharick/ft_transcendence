import { FC, useContext } from 'react';
import { UserContext } from './userProvider';
import OauthPopup from 'react-oauth-popup';
import Link from 'next/link';

const UserHeaderBlock: FC = () => {
  const userContext = useContext(UserContext);

  return (
    <section className="user-header-block">
      {userContext.user ? (
        <>
          <Link href={`/users/${userContext.user.id}`}>
            <a className="user-header-block-username">
              {userContext.user.username}
            </a>
          </Link>
          <button onClick={userContext.handleLogout}>Logout</button>
        </>
      ) : (
        <OauthPopup
          url="/api/auth/login"
          title="Login"
          width={600}
          height={650}
          onClose={() => 0}
          onCode={userContext.handleLogin || (() => 0)}
        >
          <button>Login via 42</button>
        </OauthPopup>
      )}
    </section>
  );
};

export default UserHeaderBlock;
