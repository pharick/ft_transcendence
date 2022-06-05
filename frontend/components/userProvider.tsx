import { createContext, FC, ReactNode, useEffect, useState } from 'react';
import { UserInfo } from '../types/interfaces';

interface UserProviderProps {
  children?: ReactNode;
}

interface UserContext {
  user?: UserInfo;
  handleLogout?: () => void;
  userSessionId?: string;
}

export const userContext = createContext<UserContext>({});

const UserProvider: FC<UserProviderProps> = ({ children }) => {
  const [user, setUser] = useState<UserInfo>();
  const [userSessionId, setUserSessionId] = useState<string>();

  const handleLogout = async () => {
    await fetch('/api/auth/logout', { method: 'POST' });
    setUser(undefined);
  };

  useEffect(() => {
    const getUser = async () => {
      const response = await fetch('/api/auth/me');
      const data = await response.json();
      console.log(data);
      setUser(data.user);
      setUserSessionId(data.userSessionId);
    };
    getUser().then();
  }, []);

  const value = { user, handleLogout, userSessionId };

  return <userContext.Provider value={value}>{children}</userContext.Provider>;
};

export default UserProvider;
