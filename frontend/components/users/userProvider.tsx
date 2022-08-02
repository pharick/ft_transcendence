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
import { UserInfo } from '../../types/interfaces';
import { RequestErrorHandlerContext } from '../utils/requestErrorHandlerProvider';
import { fetchWithHandleErrors } from '../../utils';

interface UserProviderProps {
  children?: ReactNode;
}

interface UserContextInterface {
  user?: UserInfo;
  handleLogin?: (code: string, params: URLSearchParams) => void;
  handleLogout?: () => void;
  userSessionId?: string;
}

export const UserContext = createContext<UserContextInterface>({});

const UserProvider: FC<UserProviderProps> = ({ children }) => {
  const [user, setUser] = useState<UserInfo>();
  const requestErrorHandlerContext = useContext(RequestErrorHandlerContext);

  const handleLogin = async (code: string, params: URLSearchParams) => {
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
    const token = localStorage.getItem('token');
    const userResponse = await fetchWithHandleErrors({
      requestErrorHandlerContext,
      url: '/api/users/me',
      token: token || '',
    });
    console.log(userResponse);
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
