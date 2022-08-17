import { FC } from 'react';
import UserHeaderBlock from '../users/userHeaderBlock';
import Link from 'next/link';

import styles from '../../styles/Header.module.css';

const Header: FC = () => {
  return (
    <header className={styles.header}>
      <Link href="/">
        <a className={styles.brand}>ft_transcendence</a>
      </Link>

      <ul className={styles.mainMenu}>
        <li className={styles.mainMenuItem}>
          <Link href="/games">
            <a className={styles.mainMenuLink}>Games</a>
          </Link>
        </li>
        <li className={styles.mainMenuItem}>
          <Link href="/users">
            <a className={styles.mainMenuLink}>Players</a>
          </Link>
        </li>
        <li className={styles.mainMenuItem}>
          <Link href="/chat">
            <a className={styles.mainMenuLink}>Chat</a>
          </Link>
        </li>
      </ul>

      <UserHeaderBlock />
    </header>
  );
};

export default Header;
