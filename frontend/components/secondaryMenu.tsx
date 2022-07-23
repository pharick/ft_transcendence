import { FC } from 'react';
import UserBlock from '../components/userBlock';
import { userContext } from './userProvider';
import Link from 'next/link';

const SecondaryMenu: FC = () => {
  return (
    <nav className="secondary-menu">
      <ul className="secondary-menu-list">
        <li>
          <Link href="/games">
            <a className="secondary-menu-link">Games</a>
          </Link>
        </li>
        <li>
          <Link href="/users">
            <a className="secondary-menu-link">Players</a>
          </Link>
        </li>
        <li>
          <Link href="/chat">
            <a className="secondary-menu-link">Chats</a>
          </Link>
        </li>
      </ul>
    </nav>
  );
};

export default SecondaryMenu;
