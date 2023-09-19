import React, { useEffect, useRef, useState } from 'react';
import { BsInfoCircle, BsInfoCircleFill } from 'react-icons/bs';
import ChatHeader from './ChatHeader';
import { useTranslation } from 'react-i18next';
import ChatContent from './ChatContent';
import { MiniUserType, allMessType } from '../../../constants/type';

interface ChatProp {
  setShowEdit: React.Dispatch<React.SetStateAction<boolean>>;
  showEdit: boolean;
  memberWithoutMe: MiniUserType[];
  conversation: allMessType[];
  handleKeyDown: (
    e: React.KeyboardEvent<HTMLInputElement>,
    mess: string
  ) => Promise<void>;
  newMessages: allMessType[];
  input: string;
  setInput: React.Dispatch<React.SetStateAction<string>>;
}

const Chat = ({
  setShowEdit,
  showEdit,
  memberWithoutMe,
  conversation,
  handleKeyDown,
  newMessages,
  input,
  setInput,
}: ChatProp) => {
  const { t } = useTranslation(['message']);
  const scrollRef = useRef<HTMLDivElement>(null);
  const [mess, setMess] = useState('');

  // đóng ô edit chat
  const handleEditInfo = () => {
    setShowEdit((pre) => !pre);
  };

  // kiểm tra xem có hiển thị avatar hay không
  const shouldShowAvatar = (conversation: allMessType[], index: number) => {
    const currentUserId = conversation[index]?.user?.id;
    const nextUserId = conversation[index + 1]?.user?.id;
    if (currentUserId === nextUserId) return false;
    else return true;
  };
  // nhập tin nhắn
  const handleInputChat = (e: React.ChangeEvent<HTMLInputElement>) => {
    const inputMess = e.target.value;
    setInput(e.target.value);
    if (inputMess.trim() !== '') setMess(inputMess.trim());
  };
  // Cuộn xuống cuối trang
  useEffect(() => {
    setTimeout(() => {
      if (scrollRef.current) {
        scrollRef.current.scrollIntoView({
          behavior: 'smooth',
        });
      }
    }, 70);
  }, [conversation, newMessages]);

  return (
    <div className='md:border-l md:border-gray-1 dark:border-gray-setting w-full flex flex-col justify-between h-full'>
      <div
        className='border-b border-gray-1 dark:border-gray-setting p-3 flex items-center justify-between
      '
      >
        <div className='flex gap-3 items-center'>
          {memberWithoutMe?.length > 1 ? (
            <div className='relative mt-2 w-[44px] h-[44px]'>
              <img
                src={memberWithoutMe[0]?.avatar}
                alt=''
                className='w-8 h-8 overflow-hidden object-cover rounded-full'
              />
              <img
                src={memberWithoutMe[1]?.avatar}
                alt=''
                className='w-8 h-8 overflow-hidden object-cover rounded-full absolute top-3 left-3 
            border-2 border-white dark:border-black'
              />
            </div>
          ) : (
            <img
              src={memberWithoutMe[0]?.avatar}
              alt=''
              className='w-[52px] h-[52px] overflow-hidden object-cover rounded-full'
            />
          )}
          <div className=' flex flex-row gap-1'>
            {memberWithoutMe?.map((mb, index) => (
              <span className='font-semibold pt-2' key={mb?.id}>
                {mb?.fullName}
                {index !== memberWithoutMe.length - 1 ? ', ' : ''}
              </span>
            ))}
          </div>
        </div>
        <span onClick={handleEditInfo}>
          {showEdit ? (
            <BsInfoCircleFill size={21} />
          ) : (
            <BsInfoCircle size={21} />
          )}
        </span>
      </div>
      <div className='overflow-y-auto w-full flex flex-col justify-start'>
        <ChatHeader date={conversation[0]?.date} member={memberWithoutMe} />
        <div>
          {conversation.length > 0 &&
            conversation.map((conver, index: number) => (
              <ChatContent
                conver={conver}
                key={conver?.id}
                showAvatar={shouldShowAvatar(conversation, index)}
              />
            ))}
          {newMessages.length > 0 &&
            newMessages.map((conver, index: number) => (
              <ChatContent
                conver={conver}
                key={conver?.id}
                showAvatar={shouldShowAvatar(newMessages, index)}
              />
            ))}
          <div ref={scrollRef} />
        </div>
      </div>
      <div className='flex h-[44px] m-3 rounded-l-full rounded-r-full border border-gray-1 p-2 '>
        <input
          type='text'
          className='w-full outline-none px-2 dark:bg-black'
          placeholder={t('mess...')}
          onChange={handleInputChat}
          onKeyDown={(e) => handleKeyDown(e, mess)}
          value={input}
        />
      </div>
    </div>
  );
};

export default Chat;
