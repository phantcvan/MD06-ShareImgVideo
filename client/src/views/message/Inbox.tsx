import React, { useEffect, useRef, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { setPickMenu } from '../../stores/slices/appSlice';
import { useTranslation } from 'react-i18next';
import LeftMenu from './components/LeftMenu';
import Intro from './components/Intro';
import '../../index.css';
import CreateConversation from './components/CreateConversation';
import { allMessType } from '../../constants/type';
import { io, Socket } from 'socket.io-client';
import { getCurrentUser } from '../../stores/slices/userSlice';
import {
  getNewMessages,
  setArrivalMessage,
  setNewGroupCode,
  setNewMessages,
} from '../../stores/slices/messageSlice';
import { getCurrentDate } from '../../constants/fn';

const Inbox = () => {
  const dispatch = useDispatch();
  const { t } = useTranslation(['home', 'message']);
  const [openSendMess, setOpenSendMess] = useState(false);
  const [createdGroup, setCreatedGroup] = useState(false);
  // const [newMessages, setNewMessages] = useState<allMessType[]>([]);
  const [deletedChat, setDeletedChat] = useState(false);
  const socket = useRef<Socket | null>(null);
  const currentUser = useSelector(getCurrentUser);
  const [deleteGroup, setDeleteGroup] = useState<string>('');
  // const [newGroupCode, setNewGroupCode] = useState<string>('');
  const newMessages = useSelector(getNewMessages);

  // update title
  const updateTitle = () => {
    document.title = 'Inbox ・ Chats';
  };
  useEffect(() => {
    dispatch(setPickMenu('messages_sb'));
    updateTitle();
  }, []);

  useEffect(() => {
    socket.current = io('ws://localhost:8900');
    socket.current.on('getMessage', (data) => {
      console.log('newData INBOX', data);
      
      dispatch(setNewGroupCode(data?.chatCode));
      const date = getCurrentDate();
      const newArrival = {
        send_id: data.senderId,
        mess: data.text,
        date,
        converCode: data.chatCode,
      };
      dispatch(setArrivalMessage(newArrival));
      const newMess = [...newMessages, newArrival];
      dispatch(setNewMessages(newMess));
    });
    if (socket.current) {
      socket?.current.emit('addUser', currentUser?.id);
      socket?.current.on('getUsers', (users) => {
        // setOnlineUsers(
        //   user.followings.filter((f) => users.some((u) => u.userId === f))
        // );
      });
    }
  }, [currentUser]);

  return (
    <div className='flex flex-row max-h-screen max-w-screen hide-scrollbar-x w-[100%]'>
      <div className='flex-1 min-h-[300px]'>
        <LeftMenu
          setOpenSendMess={setOpenSendMess}
          createdGroup={createdGroup}
          newMessages={newMessages}
          deletedChat={deletedChat}
          deleteGroup={deleteGroup}
          setDeleteGroup={setDeleteGroup}
        />
      </div>
      <div className='md:flex-3 flex-1 overflow-y-auto'>
        <Intro setOpenSendMess={setOpenSendMess} />
      </div>
      {openSendMess && (
        <CreateConversation
          setOpenSendMess={setOpenSendMess}
          setCreatedGroup={setCreatedGroup}
        />
      )}
    </div>
  );
};

export default Inbox;
