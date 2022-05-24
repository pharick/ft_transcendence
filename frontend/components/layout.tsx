import { FC, ReactNode } from 'react';
import Header from './header';


interface LayoutProps {
  children: ReactNode,
}

const Layout: FC<LayoutProps> = ({ children }) => {

  return (
    <>
      <Header />
      <main>{children}</main>
    </>
  );
};

export default Layout;
