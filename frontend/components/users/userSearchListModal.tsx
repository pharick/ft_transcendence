import { FC, useState } from 'react';
import { User } from '../../types/interfaces';
import dynamic from 'next/dynamic';
const Modal = dynamic(() => import('../../components/layout/modal'), {
  ssr: false,
});
import styles from '../../styles/UserSearchListModal.module.css';
import PlayerBlockSmall from './playerBlockSmall';

interface UserSearchListModalProps {
  users: User[];
  isOpen: boolean;
  title: string;
  cancelButtonHandler: () => void;
  actionButtonText: string;
  actionButtonHandler: (user: User) => Promise<boolean>;
}

const UserSearchListModal: FC<UserSearchListModalProps> = ({
  users,
  isOpen,
  title,
  cancelButtonHandler,
  actionButtonText,
  actionButtonHandler,
}) => {
  const [searchValue, setSearchValue] = useState('');

  const handleButton = async (user: User) => {
    await actionButtonHandler(user);
  };

  return (
    <Modal
      isOpen={isOpen}
      title={title}
      cancelButtonHandler={cancelButtonHandler}
    >
      <div>
        <input
          className={styles.searchInput}
          type="text"
          placeholder="Type to search"
          value={searchValue}
          onChange={(e) => {
            setSearchValue(e.target.value);
          }}
        />
        <ul className={styles.list}>
          {users
            .filter((user) => user.username.startsWith(searchValue))
            .map((user) => (
              <li className={styles.item} key={user.id}>
                <PlayerBlockSmall user={user} showUsername={false} />
                <p className={styles.username}>{user.username}</p>
                <div className="ms-auto">
                  <button
                    onClick={() => {
                      handleButton(user).then();
                    }}
                  >
                    {actionButtonText}
                  </button>
                </div>
              </li>
            ))}
        </ul>
      </div>
    </Modal>
  );
};

export default UserSearchListModal;
