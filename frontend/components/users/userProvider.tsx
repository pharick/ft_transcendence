import {
  createContext,
  FC,
  ReactNode,
  useContext,
  useEffect,
  useMemo,
  useState,
} from 'react';
import { User } from '../../types/interfaces';
import { RequestErrorHandlerContext } from '../utils/requestErrorHandlerProvider';
import { fetchWithHandleErrors } from '../../utils';
import { io } from 'socket.io-client';

interface UserProviderProps {
  children?: ReactNode;
}

interface UserContextInterface {
  user?: User;
  handleLogin?: (code: string, params: URLSearchParams) => void;
  handleLogout?: () => void;
}

export const UserContext = createContext<UserContextInterface>({});

const UserProvider: FC<UserProviderProps> = ({ children }) => {
  const [user, setUser] = useState<User>(null);
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
    setUser(null);
    localStorage.clear();
  };

  const getUser = async () => {
    const userResponse = await fetchWithHandleErrors({
      requestErrorHandlerContext,
      url: '/api/users/me',
    });
    if (userResponse?.ok) {
      const user = await userResponse?.json();
      setUser(user);
    }
  };

  useEffect(() => {
    getUser().then();
  }, []);

  useEffect(() => {
    const statusSocket = io(
      `${
        process.env.NODE_ENV == 'development'
          ? process.env.NEXT_PUBLIC_INTERNAL_API_URL
          : ''
      }/status`,
      {
        auth: { token: localStorage.getItem('token') },
      },
    );

    return () => {
      statusSocket.disconnect();
    };
  }, [user?.id]);

  const value = useMemo(
    () => ({
      user,
      handleLogin,
      handleLogout,
    }),
    [user?.id],
  );

  return <UserContext.Provider value={value}>{children}</UserContext.Provider>;
};

export default UserProvider;
