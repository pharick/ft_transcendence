import { FC } from 'react';
import UserBlock from '../users/userBlock';
import { userContext } from '../users/userProvider';
import Link from 'next/link';

const Header: FC = () => {
  return (
    <header className="header">
      <Link href="/">
        <a className="brand">ft_transcendence</a>
      </Link>

      <ul className="main-menu">
        <li>
          <Link href="/games">
            <a>Games</a>
          </Link>
        </li>
        <li>
          <Link href="/users">
            <a>Players</a>
          </Link>
        </li>
        <li>
          <Link href="/chat">
            <a>Chats</a>
          </Link>
        </li>
      </ul>

      <userContext.Consumer>
        {({ user, handleLogout }) => (
          <UserBlock user={user} handleLogout={handleLogout} />
        )}
      </userContext.Consumer>
    </header>
  );
};

export default Header;
