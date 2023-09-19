import { Avatar } from 'antd';
import { useTranslation } from 'react-i18next';
import { useSelector } from 'react-redux';
import { getCurrentUser } from '../../../stores/slices/userSlice';
import { getSuggestAPI } from '../../../services/post';
import { useEffect, useState } from 'react';
import SuggestionsFollow from './suggestions/SuggestionsFollow';
import { NavLink } from 'react-router-dom';
const Suggestions = () => {
  const [suggests, setSuggests] = useState<any[]>([]);
  const { t } = useTranslation(['home']);

  // Lấy thông tin user
  const currentUser = useSelector(getCurrentUser);

  const getSuggest = async (userId: number) => {
    const response: any = await getSuggestAPI(userId);
    if (Array.isArray(response)) setSuggests(response);
  };

  useEffect(() => {
    const { id: userId } = currentUser || {};
    if (userId) {
      getSuggest(userId);
    }
  }, [currentUser]);

  return (
    <div className='mt-10 lg:block md:hidden pr-5 '>
      <div className='flex items-center justify-between'>
        <div className='flex items-center gap-3'>
          <NavLink to={`/profile/${currentUser?.userCode}`}>
            <Avatar
              src={currentUser?.avatar}
              className='cursor-pointer'
              size={60}
            >
              ĐN
            </Avatar>
          </NavLink>
          <div>
            <p className='font-semibold cursor-pointer'>
              {currentUser?.userName}
            </p>
            <p className='font-normal text-sm'>{currentUser?.fullName}</p>
          </div>
        </div>
        {/* <p className='font-semibold text-[rgb(0,149,246)] cursor-pointer'>
          {t('transfer_sg')}
        </p> */}
      </div>
      <div className='flex justify-between items-center mt-6 align-center'>
        <p className='font-semibold text-[rgb(115,115,115)] '>
          {t('for_you_sg')}
        </p>
        {/* <p className='cursor-pointer'>{t('See_all_sg')}</p> */}
      </div>
      {suggests.map((suggest: any, index) => (
        <SuggestionsFollow suggest={suggest} key={index} />
      ))}
    </div>
  );
};

export default Suggestions;
