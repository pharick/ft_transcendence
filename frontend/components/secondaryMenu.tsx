import { FC } from 'react';
import Link from 'next/link';
import { MenuItem } from '../types/interfaces';

interface SecondaryMenuProps {
  items?: MenuItem[],
}

const SecondaryMenu: FC<SecondaryMenuProps> = ({ items }) => {
  return (
    <nav className="secondary-menu">
      {items &&
        <ul className="secondary-menu-list">
          {items.map((item, i) => (
            <li key={i}>
              <Link href={item.link}>
                <a className="secondary-menu-link">
                  {item.text}
                </a>
              </Link>
            </li>
          ))}
        </ul>
      }
    </nav>
  );
};

export default SecondaryMenu;
