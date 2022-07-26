import { FC, ReactNode } from 'react';
import Header from './header';
import Aside from './aside';

interface LayoutProps {
  children: ReactNode;
}

const Layout: FC<LayoutProps> = ({ children }) => {
  return (
    <>
      <Header />
      <div className="container">
        <Aside />
        <main className="main">{children}</main>
      </div>
    </>
  );
};

export default Layout;