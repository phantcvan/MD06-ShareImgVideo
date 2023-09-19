import React, { useCallback, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { AiOutlineClose } from 'react-icons/ai';
import { Link, useNavigate } from 'react-router-dom';
import { MiniUserType, UserType } from '../../../constants/type';
import { searchAPI } from '../../../services/user';
import { useSelector } from 'react-redux';
import { getCurrentUser } from '../../../stores/slices/userSlice';
import { createGroupAPI } from '../../../services/message';
import { PATH } from '../../../services/list-path';
import { debounce } from '../../../constants/fn';
import { Socket } from 'socket.io-client';

interface SearchAccProp {
  setOpenSendMess: React.Dispatch<React.SetStateAction<boolean>>;
  setCreatedGroup: React.Dispatch<React.SetStateAction<boolean>>;
  // setNewGroupCode: React.Dispatch<React.SetStateAction<string>>;
}
const CreateConversation = ({
  setOpenSendMess,
  setCreatedGroup,
  // setNewGroupCode,
}: SearchAccProp) => {
  const { t } = useTranslation(['message']);
  const [search, setSearch] = useState<MiniUserType[]>([]);
  const [selectedMember, setSelectedMember] = useState<MiniUserType[]>([]);
  const currentUser = useSelector(getCurrentUser);
  const navigate = useNavigate();
  const socket = useRef<Socket | null>(null);

  const handleCloseSendMess = () => {
    setOpenSendMess(false);
  };

  // Tìm kiếm người dùng
  const handleChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const value = event.target.value;
    if (value.trim()) {
      const response: any = await searchAPI({ q: value.trim() });
      const { status, users } = response || {};
      if (status === 200) {
        const filterUser = users.filter(
          (user: MiniUserType) => user.id !== currentUser?.id
        );
        setSearch(filterUser);
      }
    }
  };
  //useCalback
  const optimisedVersion = useCallback(debounce(handleChange, 300), []);
  // Chọn người dùng tham gia nhóm chat
  const handleSelectMember = (user: MiniUserType) => {
    if (!selectedMember.some((member) => member.id === user.id)) {
      setSelectedMember([...selectedMember, user]);
    }
  };
  const handleRemoveMember = (user: MiniUserType) => {
    setSelectedMember(selectedMember.filter((member) => member.id !== user.id));
  };
  // tạo cuộc hội thoại mới, hoặc mở cuộc hội thoại đã có
  const handleCreateGroup = async () => {
    if (selectedMember.length > 0) {
      const idList = [...selectedMember, currentUser]
        .map((mb) => mb.id)
        .join(', ');
      const members = { members: idList };
      const response: any = await createGroupAPI(members);
      if (response?.status === 200) {
        setCreatedGroup((pre) => !pre);
        setOpenSendMess(false);
        navigate(
          `${PATH.MESSAGE.replace(':chatCode', response?.group?.converCode)}`
        );
      } else if (response?.status === 201) {
        // Gửi thông báo đến Socket
        // selectedMember.map((member) =>
        //   socket?.current?.emit('addNewGroup', {
        //     senderId: currentUser.id,
        //     receiverId: member.id,
        //     chatCode: response?.converCode,
        //   })
        // );
        setCreatedGroup((pre) => !pre);
        setOpenSendMess(false);
        navigate(`${PATH.MESSAGE.replace(':chatCode', response?.converCode)}`);
      }
    }
  };

  return (
    <div className='absolute top-0 left-0 z-20 w-screen h-screen bg-overlay-40 flex items-center justify-center'>
      <div
        className='w-[100%] h-[100%] fixed top-0 left-0 bg-overlay-40 flex items-center 
    justify-center z-20'
        onClick={handleCloseSendMess}
      ></div>
      <div className='bg-white dark:bg-gray-setting w-1/2 h-2/3 flex justify-center z-30 rounded-lg relative'>
        <div
          className='absolute top-5 right-5 cursor-pointer '
          onClick={handleCloseSendMess}
        >
          <AiOutlineClose size={21} />
        </div>
        <div className='flex flex-col gap-2 w-full mb-2'>
          <span className='text-center py-3 font-semibold text-lg border-b border-gray-1 w-[100%]'>
            {t('new_mess')}{' '}
          </span>
          <div className='flex flex-col border-b border-gray-1 pb-3'>
            <div className='flex items-center justify-between'>
              <span className='font-semibold px-3 min-w-fit'>{t('to')}:</span>
              <input
                type='text'
                placeholder={t('search')}
                className='w-full outline-none dark:bg-gray-text-w rounded-sm p-1'
                onChange={optimisedVersion}
              />
            </div>
            <div className='px-3 flex gap-2 flex-wrap mt-1'>
              {selectedMember.length > 0 &&
                selectedMember?.map((member) => (
                  <div
                    className='flex gap-2 bg-[#E0F1FF] text-blue rounded-lg w-fit items-center justify-center'
                    key={member?.id}
                  >
                    <span className='pl-2 py-1'>{member?.userName}</span>
                    <span
                      className='pt-1 cursor-pointer'
                      onClick={() => handleRemoveMember(member)}
                    >
                      <AiOutlineClose />
                    </span>
                  </div>
                ))}
            </div>
          </div>
          <div className='h-2/3 flex gap-3 flex-col overflow-y-auto'>
            {search.length > 0 ? (
              search.map((acc) => (
                <div
                  className='flex items-center justify-between gap-3 px-3 cursor-pointer'
                  onClick={() => handleSelectMember(acc)}
                >
                  <div className='w-11 h-11'>
                    <img
                      src={acc?.avatar}
                      alt=''
                      className='w-11 h-11 overflow-hidden object-cover rounded-full'
                    />
                  </div>
                  <div className='flex flex-col gap-1 flex-1'>
                    <span>{acc?.fullName}</span>
                    <span className='text-xs text-gray-text-w'>
                      {acc?.userName}
                    </span>
                  </div>
                </div>
              ))
            ) : (
              <div className='px-3'>
                <span>{t('not_found')}</span>
              </div>
            )}
          </div>
          <div
            className={`m-2 py-2 rounded-lg flex items-center ${
              selectedMember.length > 0
                ? 'bg-blue-chat text-white cursor-pointer'
                : 'bg-[#B2DFFC] text-[#425867]'
            }`}
            onClick={handleCreateGroup}
          >
            <span className='m-auto'>{t('chat')}</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CreateConversation;
