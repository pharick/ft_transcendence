import {
  createContext,
  FC,
  ReactNode,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from 'react';
import { User } from '../../types/interfaces';
import { RequestErrorHandlerContext } from '../utils/requestErrorHandlerProvider';
import { fetchWithHandleErrors } from '../../utils';

interface UserProviderProps {
  children?: ReactNode;
}

interface UserContextInterface {
  user?: User;
  handleLogin?: (code: string, params: URLSearchParams) => void;
  handleLogout?: () => void;
  userSessionId?: string;
}

export const UserContext = createContext<UserContextInterface>({});

const UserProvider: FC<UserProviderProps> = ({ children }) => {
  const [user, setUser] = useState<User>();
  const requestErrorHandlerContext = useContext(RequestErrorHandlerContext);

  const handleLogin = async (code: string) => {
    const tokenResponse = await fetchWithHandleErrors({
      requestErrorHandlerContext,
      url: `/api/auth/token?code=${code}`,
    });
    const { access_token } = await tokenResponse?.json();
    localStorage.setItem('token', access_token);
    await getUser();
  };

  const handleLogout = () => {
    setUser(undefined);
    localStorage.clear();
  };

  const getUser = useCallback(async () => {
    const userResponse = await fetchWithHandleErrors({
      requestErrorHandlerContext,
      url: '/api/users/me',
    });
    if (userResponse?.ok) {
      const user = await userResponse?.json();
      setUser(user);
    }
  }, []);

  useEffect(() => {
    getUser().then();
  }, [getUser]);

  const value = useMemo(
    () => ({
      user,
      handleLogin,
      handleLogout,
    }),
    [user],
  );

  return <UserContext.Provider value={value}>{children}</UserContext.Provider>;
};

export default UserProvider;
