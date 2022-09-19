import { FC } from 'react';

import styles from '../../styles/Footer.module.css';
import Link from 'next/link';

const Footer: FC = () => {
  return (
    <footer className={`${styles.footer} mt-auto`}>
      <div className="row">
        <div className="col"></div>
        <div className="col-auto">
          Made with 🤯 by{' '}
          <Link href="https://profile.intra.42.fr/users/cbelva">
            <a>cbelva</a>
          </Link>
          ,{' '}
          <Link href="https://profile.intra.42.fr/users/jasougi">
            <a>jasougi</a>
          </Link>
          ,{' '}
          <Link href="https://profile.intra.42.fr/users/lsinistr">
            <a>lsinistr</a>
          </Link>{' '}
          and{' '}
          <Link href="https://profile.intra.42.fr/users/mlaureen">
            <a>mlaureen</a>
          </Link>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
