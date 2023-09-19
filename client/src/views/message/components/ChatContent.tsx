import React from 'react';
import { allMessType } from '../../../constants/type';
import { useSelector } from 'react-redux';
import { getCurrentUser } from '../../../stores/slices/userSlice';
import { Link } from 'react-router-dom';
import { PATH } from '../../../services/list-path';

interface ContentProp {
  conver: allMessType;
  showAvatar: boolean;
}
const ChatContent = ({ conver, showAvatar }: ContentProp) => {
  const currentUser = useSelector(getCurrentUser);
  const messOwn = conver?.user?.id === currentUser?.id;

  return (
    <div className='px-3 flex flex-col gap-2 mt-3'>
      <div className='flex flex-col gap-2'>
        <div className={`flex items-center gap-2 ${messOwn && 'justify-end'}`}>
          {!messOwn && showAvatar ? (
            <div>
              <Link
                to={`${PATH.PROFILE.replace(
                  ':userCode',
                  conver?.user?.userCode
                )}`}
              >
                <img
                  src={conver?.user?.avatar}
                  alt=''
                  className='w-7 h-7 overflow-hidden object-cover rounded-full'
                />
              </Link>
            </div>
          ) : (
            <div className='w-7 h-7'></div>
          )}

          <span
            className={` rounded-lg p-2 w-fit max-w-[70%] ${
              messOwn
                ? 'bg-blue-chat text-white'
                : 'bg-gray-chat dark:text-black'
            }`}
          >
            {conver.mess}
          </span>
        </div>
      </div>
    </div>
  );
};

export default ChatContent;
