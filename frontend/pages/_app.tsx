import type { AppProps } from 'next/app';
import UserProvider from '../components/userProvider';
import '../style.css';

const MyApp = ({ Component, pageProps }: AppProps) => {

  return (
    <UserProvider>
      <Component {...pageProps} />
    </UserProvider>
  )
};

export default MyApp
