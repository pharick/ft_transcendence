import { FC } from 'react';
import { ChatRoomUser } from '../../types/interfaces';
import Dropdown from '../layout/dropdown';

interface RoomUserButtonsProps {
  user: ChatRoomUser;
}

const RoomUserButtons: FC<RoomUserButtonsProps> = () => {
  return (
    <Dropdown
      menu={[
        { text: 'Not admin', callback: () => {} },
        { text: 'Block', callback: () => {} },
        { text: 'Mute', callback: () => {} },
      ]}
    />
  );

  // {(currentUser?.type == ChatRoomUserType.Owner ||
  //   currentUser?.type == ChatRoomUserType.Admin) && (
  //   <ul className={styles.buttons}>
  //     <li>
  //       <button className="icon-button">
  //         <Image
  //           src={adminImage}
  //           alt="Admin"
  //           layout="fixed"
  //           width={20}
  //           height={20}
  //         />
  //         Make admin
  //       </button>
  //     </li>
  //     <li>
  //       <button className="icon-button">
  //         <Image
  //           src={banImage}
  //           alt="Ban"
  //           layout="fixed"
  //           width={20}
  //           height={20}
  //         />
  //         Block
  //       </button>
  //     </li>
  //   </ul>
  // )}
};

export default RoomUserButtons;
