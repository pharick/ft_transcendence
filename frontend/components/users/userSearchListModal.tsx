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
  errorButtonText: string;
  actionButtonHandler: (user: User) => Promise<boolean>;
}

const UserSearchListModal: FC<UserSearchListModalProps> = ({
  users,
  isOpen,
  title,
  cancelButtonHandler,
  actionButtonText,
  errorButtonText,
  actionButtonHandler,
}) => {
  const [searchValue, setSearchValue] = useState('');
  const [userErrors, setUserErrors] = useState<number[]>([]);

  const handleButton = async (user: User) => {
    const res = await actionButtonHandler(user);
    if (!res) setUserErrors((prev) => prev.concat([user.id]));
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
                    className={
                      userErrors.includes(user.id) ? 'error-button' : ''
                    }
                    disabled={userErrors.includes(user.id)}
                    onClick={() => {
                      handleButton(user).then();
                    }}
                  >
                    {userErrors.includes(user.id)
                      ? errorButtonText
                      : actionButtonText}
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
