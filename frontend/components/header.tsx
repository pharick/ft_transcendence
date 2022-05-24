import { FC } from 'react';
import UserBlock from '../components/userBlock';
import { userContext } from './userProvider';
import Link from 'next/link';

const Header: FC = () => {

  return (
    <header className="header">
      <Link href="/">
        <a className="brand">ft_transcendence</a>
      </Link>

      <userContext.Consumer>
        {({ user, handleLogout }) => (
          <UserBlock user={user} handleLogout={handleLogout} />
        )}
      </userContext.Consumer>
    </header>
  );
};

export default Header;
