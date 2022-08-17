import {
  ChangeEvent,
  FC,
  FormEvent,
  useContext,
  useRef,
  useState,
} from 'react';

import styles from '../../styles/UserProfile.module.css';

import { UserContext } from './userProvider';
import { fetchWithHandleErrors } from '../../utils';
import { RequestErrorHandlerContext } from '../utils/requestErrorHandlerProvider';
import { useRouter } from 'next/router';
import { SubmitHandler, useForm } from 'react-hook-form';
import { UpdateUserProfileDto } from '../../types/dtos';

const UserProfile: FC = () => {
  const requestErrorHandlerContext = useContext(RequestErrorHandlerContext);
  const userContext = useContext(UserContext);
  const router = useRouter();

  const [avatar, setAvatar] = useState<File>();
  const avatarInput = useRef<HTMLInputElement>(null);

  const profileForm = useForm<UpdateUserProfileDto>();

  const updateProfile: SubmitHandler<UpdateUserProfileDto> = async (data) => {
    console.log(data);
    await fetchWithHandleErrors({
      requestErrorHandlerContext,
      url: `/api/users/${userContext.user?.id}`,
      method: 'PATCH',
      body: data,
    });
    router.reload();
  };

  const handleChangeAvatar = async (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target?.files && e.target?.files.length > 0) {
      setAvatar(e.target?.files[0]);
    }
  };

  const uploadAvatar = async (e: FormEvent) => {
    e.preventDefault();
    if (!avatar || (avatar.type != 'image/jpeg' && avatar.type != 'image/png'))
      return;
    const body = new FormData();
    body.append('avatar', avatar);
    await fetchWithHandleErrors({
      requestErrorHandlerContext,
      url: `/api/users/${userContext.user?.id}/avatar`,
      method: 'PUT',
      body,
    });
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
        onSubmit={profileForm.handleSubmit(updateProfile)}
      >
        <div className={styles.input}>
          <label htmlFor="username">Username</label>
          <input
            type="text"
            id="username"
            {...profileForm.register('username', {
              required: true,
              minLength: 3,
              maxLength: 15,
              value: userContext.user.username,
            })}
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
