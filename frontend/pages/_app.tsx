import type { AppProps } from 'next/app';
import UserProvider from '../components/users/userProvider';
import Layout from '../components/layout/layout';
import RequestErrorHandlerProvider from '../components/utils/requestErrorHandlerProvider';

import '../styles/style.css';
import 'bootstrap/dist/css/bootstrap-grid.css';
import 'bootstrap/dist/css/bootstrap-utilities.css';

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
