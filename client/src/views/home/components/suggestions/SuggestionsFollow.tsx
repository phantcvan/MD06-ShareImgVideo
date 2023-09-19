import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useDispatch, useSelector } from 'react-redux';
import {
  getCurrentUser,
  getFollows,
  setFollows,
} from '../../../../stores/slices/userSlice';
import { followAPI } from '../../../../services/follow';
import {
  createNotiAPI,
  deleteFollowAPI,
  deleteNotiAPI,
} from '../../../../services/user';
import { Avatar } from 'antd';
import { NavLink } from 'react-router-dom';

const SuggestionsFollow = ({ suggest }: any) => {
  const { t } = useTranslation(['home']);
  const [isFollow, setIsFollow] = useState(false);
  const follows = useSelector(getFollows);
  // Lấy thông tin user
  const currentUser = useSelector(getCurrentUser);
  const dispatch = useDispatch();

  // Follow
  const handleFollow = async (friend_id: number) => {
    const newFollow = {
      friend_id,
      user_id: currentUser?.id,
      status: 1,
    };
    const newNoti = {
      user_id: friend_id,
      interact_id: currentUser?.id,
      type: 'follow',
      post_id: null,
    };
    if (!isFollow) {
      const [response, notiRes] = await Promise.all([
        followAPI(newFollow),
        createNotiAPI(newNoti),
      ]);
      if (response?.status === 201) {
        setIsFollow(true);
        dispatch(setFollows([...follows, friend_id]));
      }
    } else {
      const [response, notiRes] = await Promise.all([
        deleteFollowAPI(currentUser?.id, friend_id),
        deleteNotiAPI(newNoti),
      ]);
      if (response?.status === 200) {
        setIsFollow(false);
        const newFollow = follows.filter((id: number) => id !== friend_id);
        dispatch(setFollows(newFollow));
      }
    }
  };
  useEffect(() => {
    const checkFollow = follows.filter((id: number) => id === suggest?.id);
    if (checkFollow.length > 0) {
      setIsFollow(true);
    } else {
      setIsFollow(false);
    }
  }, [follows, suggest]);

  return (
    <div>
      <div className='flex items-center justify-between mt-4' key={suggest?.id}>
        <div className='flex items-center gap-3'>
          <NavLink to={`/profile/${suggest?.userCode}`}>
            <Avatar src={suggest?.avatar} className='cursor-pointer' size={60}>
              ĐN
            </Avatar>
          </NavLink>
          <div>
            <NavLink to={`/profile/${suggest?.userCode}`}>
              <p className='font-semibold cursor-pointer'>
                {suggest?.userName}
              </p>
            </NavLink>
            <p className='font-normal text-sm'>{suggest?.fullName}</p>
          </div>
        </div>
        {isFollow ? (
          <p
            className='font-semibold text-[rgb(42,59,70)] hover:text-[rgb(28,38,45)] cursor-pointer'
            onClick={() => handleFollow(suggest?.id)}
          >
            {t('following')}
          </p>
        ) : (
          <p
            className='font-semibold text-[rgb(0,149,246)] hover:text-[rgb(42,59,70)] cursor-pointer'
            onClick={() => handleFollow(suggest?.id)}
          >
            {t('follow')}
          </p>
        )}
      </div>
    </div>
  );
};

export default SuggestionsFollow;
