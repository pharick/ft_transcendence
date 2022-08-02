import { FC, useContext } from 'react';
import { UserContext } from './userProvider';
import OauthPopup from 'react-oauth-popup';

const UserBlock: FC = () => {
  const userContext = useContext(UserContext);

  return (
    <section className="user-block">
      {userContext.user ? (
        <>
          <p className="user-name">{userContext.user.username}</p>
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

export default UserBlock;
