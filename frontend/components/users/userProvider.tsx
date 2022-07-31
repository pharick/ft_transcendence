import {createContext, FC, ReactNode, useCallback, useContext, useEffect, useMemo, useState} from 'react';
import { UserInfo } from '../../types/interfaces';
import {RequestErrorHandlerContext} from "../utils/requestErrorHandlerProvider";
import {fetchWithHandleErrors} from "../../utils";

interface UserProviderProps {
  children?: ReactNode;
}

interface UserContextInterface {
  user?: UserInfo;
  handleLogout?: () => void;
  userSessionId?: string;
}

export const UserContext = createContext<UserContextInterface>({});

const UserProvider: FC<UserProviderProps> = ({ children }) => {
  const [user, setUser] = useState<UserInfo>();
  const requestErrorHandlerContext = useContext(RequestErrorHandlerContext);

  const handleLogout = async () => {
    await fetchWithHandleErrors('/api/auth/logout', 'POST', requestErrorHandlerContext);
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
  }), [user]);

  return <UserContext.Provider value={value}>{children}</UserContext.Provider>;
};

export default UserProvider;
