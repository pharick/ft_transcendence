import { FC } from 'react';

import styles from '../../styles/Footer.module.css';

const Footer: FC = () => {
  return (
    <footer className={`${styles.footer} mt-auto`}>
      <div className="row">
        <div className="col"></div>
        <div className="col-auto">Made with love by team</div>
      </div>
    </footer>
  );
};

export default Footer;
