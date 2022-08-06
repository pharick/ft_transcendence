import { ChangeEvent, FC, FormEvent, useContext, useState } from 'react';
import Image from 'next/image';

import { User } from '../../types/interfaces';
import { UserContext } from './userProvider';
import { fetchWithHandleErrors } from '../../utils';
import { RequestErrorHandlerContext } from '../utils/requestErrorHandlerProvider';

const UserProfile: FC = () => {
  const userContext = useContext(UserContext);
  const [profile, setProfile] = useState<Partial<User>>({
    username: userContext.user?.username,
  });
  const [avatar, setAvatar] = useState<File>();
  const requestErrorHandlerContext = useContext(RequestErrorHandlerContext);

  // const handleUpdateDisplayName = async () => {
  //   const response = await fetch(`/api/users/${userInfo.id}/name`, {
  //     body: JSON.stringify({
  //       nickname: newDisplayName,
  //     }),
  //     headers: {
  //       'Content-Type': 'application/json',
  //     },
  //     method: 'POST',
  //   });
  //
  //   if (response.status == 400)
  //     alert(
  //       'Wrong nickname. Use ONLY letters and numbers, length 3-10 symbols',
  //     );
  // };
  //
  // const avatarLoader = ({ src }: any) => {
  //   return `http://localhost/${src}`;
  // };

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
    body.forEach((el) => {
      console.log(el);
    });
    const response = await fetchWithHandleErrors({
      requestErrorHandlerContext,
      url: `/api/users/${userContext.user?.id}/avatar`,
      method: 'PUT',
      body,
    });
    console.log(response);

    // if (response.status == 201) alert('You change avatar');
    // if (response.status == 413 || response.status == 400)
    //   alert('Wrong file. Use ONLY types: jpg, jpeg, png. Max size 500kb');
  };

  return (
    <section className="user-profile">
      <form className="user-profile-form" onSubmit={uploadAvatar}>
        <div className="user-profile-form-input">
          <input type="file" name="avatar" onChange={handleChangeAvatar} />
          <button type="submit">Change avatar</button>
        </div>
      </form>

      <form className="user-profile-form" id="change-nickname">
        <div className="user-profile-form-input">
          <label htmlFor="username">Username</label>
          <input
            type="text"
            id="username"
            name="username"
            value={profile.username}
            onChange={handleChange}
          />
        </div>
        <button className="user-profile-form-submit" type="submit">
          Update profile
        </button>
      </form>
    </section>
  );
};

export default UserProfile;
