import { FC, useEffect, useState } from 'react';

const User: FC = () => {
  const [user, setUser] = useState();
  const fetchCurrentUser = async () => {
    const response = await fetch('/api/users/me');
    const data = await response.json();
    setUser(data.user);
  };

  useEffect(() => {
    fetchCurrentUser();
  }, []);

  return (
    <section>
      {user ?
        <p>Hello, {user.username}</p>
        :
        <a
          href='https://api.intra.42.fr/oauth/authorize?client_id=8a4a10a3a225a1b0315f1872a786036f3104d8206cfd0a95b8ec2c48c5ac1d9a&redirect_uri=http%3A%2F%2Flocalhost%3A3000%2Fapi%2Fauth%2Flogin&response_type=code'>
          LogIn
        </a>
      }

    </section>
  );
};

export default User;
