import type { AppProps } from 'next/app';
import UserProvider from '../components/users/userProvider';
import '../styles/style.css';
import Layout from '../components/layout/layout';
import RequestErrorHandlerProvider from '../components/utils/requestErrorHandlerProvider';

const MyApp = ({ Component, pageProps }: AppProps) => {
  return (
    <RequestErrorHandlerProvider>
      <UserProvider>
        <Layout>
          <Component {...pageProps} />
        </Layout>
      </UserProvider>
    </RequestErrorHandlerProvider>
  );
};

export default MyApp;
