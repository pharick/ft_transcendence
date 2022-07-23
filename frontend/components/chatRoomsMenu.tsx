import { FC, useEffect, useState } from 'react';
import SecondaryMenu from './secondaryMenu';
import { ChatRoom, MenuItem, UserInfo } from '../types/interfaces';

interface ChatRoomsMenuProps {
  user?: UserInfo;
}

const ChatRoomsMenu: FC<ChatRoomsMenuProps> = ({ user }) => {
  const [links, setLinks] = useState<MenuItem[]>();

  useEffect(() => {
    const getPrivateRooms = async () => {
      const privatesResponse = await fetch(`/api/chat/rooms/private/`);
      const privates: ChatRoom[] = await privatesResponse.json();
      const privateLinks = privates.map((room) => ({
        text: user?.id == room.hostUser.id ? room.guestUser.username : room.hostUser.username,
        link: `/chat/private/${user?.id == room.hostUser.id ? room.guestUser.id : room.hostUser.id}`,
      }));
      const links = [{ text: 'Common', link: '/chat' }].concat(privateLinks);
      setLinks(links);
    }
    getPrivateRooms().then();
  }, [user?.id]);

  return (
    <SecondaryMenu items={links} />
  );
}

export default ChatRoomsMenu;
