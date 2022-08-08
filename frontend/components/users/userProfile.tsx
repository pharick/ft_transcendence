import {
  ChangeEvent,
  FC,
  FormEvent,
  useContext,
  useRef,
  useState,
} from 'react';

import styles from '../../styles/UserProfile.module.css';

import { User } from '../../types/interfaces';
import { UserContext } from './userProvider';
import { fetchWithHandleErrors } from '../../utils';
import { RequestErrorHandlerContext } from '../utils/requestErrorHandlerProvider';
import { useRouter } from 'next/router';

const UserProfile: FC = () => {
  const userContext = useContext(UserContext);
  const [profile, setProfile] = useState<Partial<User>>({
    username: userContext.user?.username,
  });
  const [avatar, setAvatar] = useState<File>();
  const requestErrorHandlerContext = useContext(RequestErrorHandlerContext);
  const avatarInput = useRef<HTMLInputElement>(null);
  const router = useRouter();

  const updateProfile = async (e: FormEvent) => {
    e.preventDefault();
    await fetchWithHandleErrors({
      requestErrorHandlerContext,
      url: `/api/users/${userContext.user?.id}`,
      method: 'PATCH',
      body: profile,
    });
    router.reload();
  };

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    setProfile((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleChangeAvatar = async (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target?.files && e.target?.files.length > 0)
      setAvatar(e.target?.files[0]);
  };

  const uploadAvatar = async (e: FormEvent) => {
    e.preventDefault();
    if (!avatar) return;
    const body = new FormData();
    body.append('avatar', avatar);
    await fetchWithHandleErrors({
      requestErrorHandlerContext,
      url: `/api/users/${userContext.user?.id}/avatar`,
      method: 'PUT',
      body,
    });
    if (avatarInput.current) avatarInput.current.value = '';
    setAvatar(undefined);
    router.reload();
  };

  return (
    <section className="mt-4">
      <form className={styles.form} onSubmit={uploadAvatar}>
        <div className={styles.input}>
          <input
            ref={avatarInput}
            type="file"
            name="avatar"
            onChange={handleChangeAvatar}
          />
          <button className={styles.submit} type="submit">
            Change avatar
          </button>
        </div>
      </form>

      <form
        className={styles.form}
        id="change-nickname"
        onSubmit={updateProfile}
      >
        <div className={styles.input}>
          <label htmlFor="username">Username</label>
          <input
            type="text"
            id="username"
            name="username"
            value={profile.username}
            onChange={handleChange}
          />
        </div>
        <button className={styles.submit} type="submit">
          Update profile
        </button>
      </form>
    </section>
  );
};

export default UserProfile;
