import { FC, ReactNode } from 'react';
import Header from './header';
import Footer from './footer';

interface LayoutProps {
  children: ReactNode;
}

const Layout: FC<LayoutProps> = ({ children }) => {
  return (
    <>
      <Header />
      <main className="main container py-4 flex-shrink-0">{children}</main>
      <Footer />
    </>
  );
};

export default Layout;
