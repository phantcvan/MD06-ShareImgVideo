import { useTranslation } from 'react-i18next';
import { MiniUserType } from '../../../constants/type';
import moment from 'moment';
import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { PATH } from '../../../services/list-path';

interface ChatHeaderProp {
  date: string;
  member: MiniUserType[];
}

const ChatHeader = ({ date, member }: ChatHeaderProp) => {
  const { t } = useTranslation(['message']);
  const [memberList, setMemberList] = useState('');
  useEffect(() => {
    const fullNameList = member.map((mb) => mb.fullName).join(', ');
    setMemberList(fullNameList);
  }, [member]);
  return (
    <div className='flex flex-col items-center justify-center gap-1 mb-2'>
      {member?.length > 1 ? (
        <div className='relative mt-2 w-24 h-24'>
          <img
            src={member[0]?.avatar}
            alt=''
            className='w-[72px] h-[72px] overflow-hidden object-cover rounded-full'
          />
          <img
            src={member[1]?.avatar}
            alt=''
            className='w-[72px] h-[72px] overflow-hidden object-cover rounded-full absolute top-5 left-5 border-2 border-white dark:border-black'
          />
        </div>
      ) : (
        <div>
          <Link
            to={`${PATH.PROFILE.replace(':userCode', member[0]?.userCode)}`}
          >
            <img
              src={member[0]?.avatar}
              alt=''
              className='w-24 h-24 overflow-hidden object-cover rounded-full mt-2'
            />
          </Link>
        </div>
      )}

      <div className=' flex flex-row gap-1'>
        <span className='font-semibold text-xl pt-2'>
          {memberList && memberList?.length > 50
            ? `${memberList.slice(0, 50)}...`
            : memberList}
        </span>
      </div>
      {member?.length === 1 ? (
        <span className='text-gray-text-w dark:text-gray-text-b text-sm'>
          {member[0]?.userName} ・ Instagram
        </span>
      ) : (
        <span className='text-gray-text-w dark:text-gray-text-b text-sm'>
          {moment(date).format('YYYY-MM-DD')}
        </span>
      )}
      {member.length === 1 && (
        <div className=' my-2'>
          <Link to={`${PATH.PROFILE.replace(':userCode', member[0].userCode)}`}>
            <span
              className='py-1 px-2 bg-gray-btn-w dark:bg-gray-btn-b cursor-pointer rounded-lg
       hover:bg-gray-1 dark:hover:bg-gray-setting'
            >
              {t('view_profile')}
            </span>
          </Link>
        </div>
      )}
    </div>
  );
};

export default ChatHeader;
