import App from 'next/app';
import type { AppContext, AppProps } from 'next/app';

const MyApp = ({ Component, pageProps }: AppProps) => {
  return <Component {...pageProps} />
};

MyApp.getInitialProps = async (appContext: AppContext) => {
  const appProps = await App.getInitialProps(appContext);
  const response = await fetch('http://localhost:3000/api/users/me');
  const user = await response.json();
  console.log(user);
  return { ...appProps, user };
};

export default MyApp
