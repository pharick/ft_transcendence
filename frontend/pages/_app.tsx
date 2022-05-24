import type { AppProps } from 'next/app';
import UserProvider from '../components/userProvider';
import '../styles/style.css';
import Layout from '../components/layout';

const MyApp = ({ Component, pageProps }: AppProps) => {

  return (
    <UserProvider>
      <Layout>
        <Component {...pageProps} />
      </Layout>
    </UserProvider>
  )
};

export default MyApp;
