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
import TwoFactorModal from './twoFactorModal';
import { SubmitHandler } from 'react-hook-form';
import { TwoFactorCodeDto } from '../../types/dtos';

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
  const requestErrorHandlerContext = useContext(RequestErrorHandlerContext);
  const [user, setUser] = useState<User>(null);
  const [twoFactorModalOpen, setTwoFactorModalOpen] = useState(false);
  const [twoFactorCodeError, setTwoFactorCodeError] = useState(false);

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
    } else if (localStorage.getItem('token')) {
      setTwoFactorModalOpen(true);
    }
  };

  const twoFactorAuth: SubmitHandler<TwoFactorCodeDto> = async (data) => {
    const tokenResponse = await fetchWithHandleErrors({
      requestErrorHandlerContext,
      url: '/api/auth/2fa_auth',
      method: 'POST',
      body: data,
    });
    if (tokenResponse.ok) {
      const { access_token } = await tokenResponse?.json();
      localStorage.setItem('token', access_token);
      await getUser();
      setTwoFactorModalOpen(false);
    } else {
      setTwoFactorCodeError(true);
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

  return (
    <>
      <UserContext.Provider value={value}>{children}</UserContext.Provider>

      <TwoFactorModal
        title="Two-factor authentication"
        isOpen={twoFactorModalOpen}
        generateNewSecret={false}
        isCodeError={twoFactorCodeError}
        cancelButtonHandler={() => {
          setTwoFactorModalOpen(false);
        }}
        checkCodeHandler={twoFactorAuth}
      />
    </>
  );
};

export default UserProvider;
