import { FC, useState } from 'react';
import styles from '../../styles/Dropdown.module.css';
import { DropdownItem } from '../../types/interfaces';

interface DropdownProps {
  menu: DropdownItem[];
}

const Dropdown: FC<DropdownProps> = ({ menu }) => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className={styles.wrapper}>
      <button
        className={styles.button}
        onClick={() => {
          setIsOpen(!isOpen);
        }}
      ></button>

      {isOpen && (
        <ul className={styles.menu}>
          {menu.map(({ text, callback }, index) => (
            <li key={index} className={styles.item}>
              <button className={styles.itemButton} onClick={callback}>
                {text}
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default Dropdown;
