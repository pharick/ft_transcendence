import type { AppProps } from 'next/app';
import UserProvider from '../components/userProvider';

const MyApp = ({ Component, pageProps }: AppProps) => {

  return (
    <UserProvider>
      <Component {...pageProps} />
    </UserProvider>
  )
};

export default MyApp
