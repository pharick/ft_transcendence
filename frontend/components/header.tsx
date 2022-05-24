import { FC } from 'react';
import UserBlock from '../components/userBlock';
import { userContext } from './userProvider';

const Header: FC = () => {

  return (
    <header className="header">
      <userContext.Consumer>
        {({ user, handleLogout }) => (
          <UserBlock user={user} handleLogout={handleLogout} />
        )}
      </userContext.Consumer>
    </header>
  );
};

export default Header;
