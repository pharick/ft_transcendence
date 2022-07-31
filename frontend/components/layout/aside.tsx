import NotificationList from '../notifications/notificationList';
import { FC, useEffect, useState } from 'react';
import { useRouter } from 'next/router';

const Aside: FC = () => {
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
        Notifications
      </button>
      <aside className={`side-panel ${isVisible ? 'side-panel-visible' : ''}`}>
        <NotificationList />
      </aside>
    </>
  );
};

export default Aside;
