import { FC, ReactNode } from 'react';
import Header from './header';

interface LayoutProps {
  children: ReactNode;
}

const Layout: FC<LayoutProps> = ({ children }) => {
  return (
    <>
      <Header />
      <div className="container">
        <main className="main">{children}</main>
      </div>
    </>
  );
};

export default Layout;
