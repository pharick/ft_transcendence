import React, { FC, FormEvent, useContext, useState } from 'react';
import { fetchWithHandleErrors } from '../../utils';
import { CreateChatRoomDto } from '../../types/dtos';
import { RequestErrorHandlerContext } from '../utils/requestErrorHandlerProvider';

const ChatRooms: FC = () => {
  const requestErrorHandlerContext = useContext(RequestErrorHandlerContext);
  const [newChatroomName, setNewChatroomName] = useState('');

  const createChatroom = async (e: FormEvent) => {
    e.preventDefault();
    if (newChatroomName.length == 0) return;
    const createChatRoomDto: CreateChatRoomDto = {
      name: newChatroomName,
    };
    const response = await fetchWithHandleErrors({
      requestErrorHandlerContext,
      url: '/api/chat/rooms',
      method: 'PUT',
      body: createChatRoomDto,
    });
    console.log(response);
  };

  return (
    <section>
      <h2>Rooms</h2>
      <form onSubmit={createChatroom}>
        <div className="row align-items-center">
          <div className="col">
            <input
              type="text"
              className="w-100"
              placeholder="New room"
              value={newChatroomName}
              onChange={(e) => setNewChatroomName(e.target.value)}
            />
          </div>
          <div className="col-auto">
            <button type="submit">Create</button>
          </div>
        </div>
      </form>
    </section>
  );
};

export default ChatRooms;
