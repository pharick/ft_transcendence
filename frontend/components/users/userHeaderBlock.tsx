import { FC, useContext } from 'react';
import { UserContext } from './userProvider';
import OauthPopup from 'react-oauth-popup';
import Link from 'next/link';

import styles from '../../styles/UserHeaderBlock.module.css';

const UserHeaderBlock: FC = () => {
  const userContext = useContext(UserContext);

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
          onCode={userContext.handleLogin || (() => 0)}
        >
          <button>Login via 42</button>
        </OauthPopup>
      )}
    </section>
  );
};

export default UserHeaderBlock;
