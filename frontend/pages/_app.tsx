import App from 'next/app';
import type { AppContext, AppProps } from 'next/app';

const MyApp = ({ Component, pageProps }: AppProps) => {
  return <Component {...pageProps} />
};

MyApp.getInitialProps = async (appContext: AppContext) => {
  const appProps = await App.getInitialProps(appContext);

  const cookie = appContext.ctx.req?.headers.cookie;
  const response = await fetch(
    'http://localhost:3000/api/users/me',
    {
      credentials: 'include',
      headers: {
        'Cookie': cookie ? cookie : '',
      },
    }
  );
  const data = await response.json();
  appProps.pageProps.initUser = data.user;
  return { ...appProps };
};

export default MyApp
