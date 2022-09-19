import { FC, useContext } from 'react';
import { UserContext } from './userProvider';
import OauthPopup from 'react-oauth-popup';
import Link from 'next/link';

import styles from '../../styles/UserHeaderBlock.module.css';

interface UserHeaderBlockProps {
  onLogin?: () => void;
}

const UserHeaderBlock: FC<UserHeaderBlockProps> = ({ onLogin }) => {
  const userContext = useContext(UserContext);

  const handleLogin = (code: string, params: URLSearchParams) => {
    userContext.handleLogin(code, params);
    if (onLogin) onLogin();
  };

  return (
    <section className={styles.userHeaderBlock}>
      {userContext.user ? (
        <>
          <Link href={`/users/${userContext.user.id}`}>
            <a className={styles.username}>{userContext.user.username}</a>
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
          onCode={handleLogin}
        >
          <button>Login via 42</button>
        </OauthPopup>
      )}
    </section>
  );
};

export default UserHeaderBlock;
