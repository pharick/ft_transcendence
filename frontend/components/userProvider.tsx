import { createContext, FC, ReactNode, useEffect, useState } from 'react';
import { User } from '../types/interfaces';

interface UserProviderProps {
  children?: ReactNode;
}

interface UserContext {
  user?: User,
  handleLogout?: () => void;
  userSessionId?: string;
}

export const userContext = createContext<UserContext>({});

const UserProvider: FC<UserProviderProps> = ({ children }) => {
  const [user, setUser] = useState<User>();
  const [userSessionId, setUserSessionId] = useState<string>();

  const getUser = async () => {
    const response = await fetch('http://localhost:3000/api/auth/me');
    const data = await response.json();
    setUser(data.user);
    setUserSessionId(data.userSessionId);
  };

  const handleLogout = async () => {
    await fetch('/api/auth/logout', { method: 'POST' });
    setUser(undefined);
  };

  useEffect(() => {
    getUser();
  }, []);

  const value = { user, handleLogout, userSessionId };

  return (
    <userContext.Provider value={value}>
      {children}
    </userContext.Provider>
  );
};

export default UserProvider;
