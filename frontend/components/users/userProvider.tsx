import { createContext, FC, ReactNode, useCallback, useEffect, useMemo, useState } from 'react';
import { UserInfo } from '../../types/interfaces';

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

  const handleLogout = async () => {
    await fetch('/api/auth/logout', { method: 'POST' });
    setUser(undefined);
  };

  const getUser = useCallback(async () => {
    const response = await fetch('/api/users/me');
    if (response.ok) {
      const user = await response.json();
      setUser(user);
    }
  }, []);

  useEffect(() => {
    getUser().then();
  }, [getUser]);

  const value = useMemo(() => ({
    user,
    handleLogout,
  }), [user])

  return <userContext.Provider value={value}>{children}</userContext.Provider>;
};

export default UserProvider;
