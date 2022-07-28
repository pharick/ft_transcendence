import { FC, useState } from 'react';
import { useRouter } from 'next/router';
import Image from 'next/image'

import { UserInfo } from '../../types/interfaces';
import { userContext } from './userProvider';


interface UserProfileProps {
  userInfo: UserInfo
}

const UserProfile: FC<UserProfileProps> = ({ userInfo }) => {
  const [image, setImage] = useState('');
  const [createObjectURL, setCreateObjectURL] = useState('');
  const [newDisplayName, setDisplayName] = useState('');
  const router = useRouter()

  const chooseAvatar = async (event: any) => {
    if (event.target.files && event.target.files[0]) {
      const i = event.target.files[0];

      setImage(i);
      setCreateObjectURL(URL.createObjectURL(i));
    }
  };

  const handleUploadAvatar = async () => {
    const body = new FormData();
    body.append('file', image);
    const response = await fetch(`/api/users/${userInfo.id}/upload`, {
      method: 'POST',
      body,
    });

    if (response.status == 201)
      alert ('You change avatar');
      router.reload();
    if (response.status == 413 || response.status == 400)
      alert ('Wrong file. Use ONLY types: jpg, jpeg, png. Max size 500kb');
  };

  const handleUpdateDisplayName = async () => {
    const response = await fetch(`/api/users/${userInfo.id}/name`, {
      body: JSON.stringify({
        nickname: newDisplayName,
      }),
      headers: {
        'Content-Type': 'application/json',
      },
      method: 'POST',
    });

    if (response.status == 400)
      alert ('Wrong nickname. Use ONLY letters and numbers, length 3-10 symbols');
  };

  const defaultAvatar = 'static/avatars/default_avatar.png'
  const avatarImage = `${userInfo.avatar ? userInfo.avatar : defaultAvatar}`
  const avatarUrl =`api/${avatarImage}`;
  const nickName = `${userInfo.displayName ? userInfo.displayName : userInfo.username}`;
  const status = `${userInfo.isOnline ? 'Online' : 'Offline'}`;
  const classStatus = `${userInfo.isOnline ? 'online-status' : 'offline-status'}`;

  const avatarLoader = ({src}: any) => {
    return `http://localhost/${src}`
  }

  return (
    <div className='block-profile'>

      <div className='avatar-profile'>
        <div className='avatar-img'>
          <Image
            layout='raw'
            loader={avatarLoader}
            src={avatarUrl}
            alt='Users avatar'
          />
        </div>
        <p className={classStatus}>{status}</p>
      </div>

      <userContext.Consumer>
        {({user}) => (
        <>
          {user?.id == userInfo.id &&
          <>
            <input type='file' name='change-avatar' onChange={chooseAvatar}/><br/>
            <button className='change-avatar' onClick={handleUploadAvatar}>
              Change avatar
            </button>
          </>
          }
        </>
        )}
      </userContext.Consumer>

      <p><b>Nickname: </b>{nickName}</p>

      <userContext.Consumer>
        {({user}) => (
        <>
          {user?.id == userInfo.id &&
          <>
            <form id='change-nickname'>
              <label>
                <input 
                  type='text'
                  id='nickname' 
                  placeholder='New nickname'
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) => setDisplayName(e.target.value)}/>
              </label><br/>
            </form>
            <button className='change-displayName' form='change-nickname' onClick={handleUpdateDisplayName}>
              Change nickname
            </button>
          </>
          }
        </>
        )}
      </userContext.Consumer>

      <p><b>Rank: </b>{userInfo.rank}</p>
    </div>
  );
};

export default UserProfile;
