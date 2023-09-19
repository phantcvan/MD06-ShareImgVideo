import React, { useEffect, useRef, useState } from 'react';
import { useSelector } from 'react-redux';
import { getCurrentUser } from '../../../stores/slices/userSlice';
import { BiEdit } from 'react-icons/bi';
import { useTranslation } from 'react-i18next';
import { getAllGroupAPI } from '../../../services/message';
import { allMessType, groupType, messType } from '../../../constants/type';
import GroupItem from './GroupItem';
import { io, Socket } from 'socket.io-client';
import {
  getArrivalMessage,
  getNewGroupCode,
} from '../../../stores/slices/messageSlice';

interface LeftMenuProp {
  setOpenSendMess: React.Dispatch<React.SetStateAction<boolean>>;
  createdGroup: boolean;
  newMessages: allMessType[];
  deletedChat: boolean;
  deleteGroup: string;
  setDeleteGroup: React.Dispatch<React.SetStateAction<string>>;
}
const LeftMenu = ({
  setOpenSendMess,
  createdGroup,
  newMessages,
  deletedChat,
  deleteGroup,
  setDeleteGroup,
}: LeftMenuProp) => {
  const currentUser = useSelector(getCurrentUser);
  const { t } = useTranslation(['message']);
  const [groups, setGroups] = useState<groupType[]>([]);
  // const [newGroup, setNewGroup] = useState(false);
  const socket = useRef<Socket | null>(null);
  const newGroupCode = useSelector(getNewGroupCode);
  const newArrival = useSelector(getArrivalMessage);
  console.log('newGroupCode', newGroupCode);

  const handleOpenSendMess = () => {
    setOpenSendMess(true);
  };

  const fetchAllGroup = async () => {
    const response: any = await getAllGroupAPI(currentUser?.id);
    if (response.status === 200) {
      const chatGroups = response?.groups;
      setGroups(chatGroups);
    }
  };

  useEffect(() => {
    fetchAllGroup();
  }, [
    currentUser,
    createdGroup,
    deletedChat,
    // newMessages,
    // newGroup,
    newGroupCode,
    newArrival,
  ]);

  // useEffect(() => {
  //   socket.current = io('ws://localhost:8900');
  //   socket.current.on('getMessage', (data) => {
  //     console.log('newData LEFTMENU', data);
  //     const group = data.chatCode || '';
  //     const checkExist = groups.some((grs) => grs.converCode === group);
  //     if (!checkExist) setNewGroup((pre) => !pre);
  //   });
  // }, [currentUser]);
  return (
    <div className='flex-col py-5 w-full overflow-x-hidden h-screen gap-3 hidden md:flex-1 md:min-h-[300px] md:inline-flex'>
      <div className='px-3 flex items-center justify-between'>
        <span className='text-xl font-bold'>{currentUser?.userName}</span>
        <span onClick={handleOpenSendMess}>
          <BiEdit size={24} />
        </span>
      </div>
      <span className='px-3 font-semibold text-lg'>{t('mess')}</span>
      <div className=' overflow-y-auto'>
        <div className='px-3 flex flex-col gap-5'>
          {groups?.length > 0 &&
            groups?.map((group) => {
              const deleteGroupArray = deleteGroup?.split(', ') || [];
              if (!deleteGroupArray.includes(group?.converCode)) {
                return (
                  <GroupItem
                    group={group}
                    key={group?.id}
                    newMessages={newMessages}
                    setDeleteGroup={setDeleteGroup}
                    deleteGroup={deleteGroup}
                  />
                );
              }
              return null;
            })}
        </div>
      </div>
    </div>
  );
};

export default LeftMenu;
