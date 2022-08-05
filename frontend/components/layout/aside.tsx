import { FC, ReactNode, useEffect, useState } from 'react';
import { useRouter } from 'next/router';

interface AsideProps {
  buttonText: string;
  children?: ReactNode;
}

const Aside: FC<AsideProps> = ({ buttonText, children }) => {
  const router = useRouter();
  const [isVisible, setIsVisible] = useState(false);

  const toggle = () => {
    setIsVisible(!isVisible);
  };

  useEffect(() => {
    if (isVisible) {
      setIsVisible(false);
    }
  }, [router.asPath]);

  return (
    <>
      <button
        onClick={toggle}
        className={`side-panel-button ${
          isVisible ? 'side-panel-button-visible' : ''
        }`}
      >
        {buttonText}
      </button>
      <aside className={`side-panel ${isVisible ? 'side-panel-visible' : ''}`}>
        {children}
      </aside>
    </>
  );
};

export default Aside;
