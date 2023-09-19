import { Avatar } from 'antd';
import { useSelector } from 'react-redux';
import { getCurrentUser } from '../../../stores/slices/userSlice';
import { deleteFollowAPI } from '../../../services/user';
import { useTranslation } from 'react-i18next';
import { NavLink, useParams } from 'react-router-dom';

const MainModal = ({
  follower,
  isFollower,
  setIsChange,
  setIsFollowesModalOpen,
  setIsFollowersModalOpen,
}: any) => {
  // Lấy thông tin user
  const currentUser = useSelector(getCurrentUser);
  const param = useParams();

  const { t } = useTranslation(['profile']);

  const handlefolower = async (friend_id: number) => {
    await deleteFollowAPI(currentUser?.id, friend_id);
    setIsChange((pre: boolean) => !pre);
  };
  return (
    <div className='flex mt-4 items-center justify-between '>
      <div className='flex items-center gap-2'>
        <NavLink
          to={`/profile/${
            follower?.user?.userCode || follower?.friend?.userCode
          }`}
        >
          {follower?.user ? (
            <Avatar
              src={follower?.user?.avatar}
              size={50}
              onClick={() => setIsFollowersModalOpen(false)}
            >
              ĐN
            </Avatar>
          ) : (
            <Avatar
              src={follower?.friend?.avatar}
              size={50}
              onClick={() => setIsFollowesModalOpen(false)}
            >
              ĐN
            </Avatar>
          )}
        </NavLink>
        <div className='flex flex-col items-start'>
          {follower?.user ? (
            <NavLink to={`/profile/${follower?.user?.userCode}`}>
              <p
                className='font-semibold'
                onClick={() => setIsFollowesModalOpen(false)}
              >
                {follower?.user?.userName}
              </p>
            </NavLink>
          ) : (
            <NavLink to={`/profile/${follower?.friend?.userCode}`}>
              <p
                className='font-semibold'
                onClick={() => setIsFollowersModalOpen(false)}
              >
                {follower?.friend?.userName}
              </p>
            </NavLink>
          )}

          <p>{follower?.user?.fullName || follower?.friend?.fullName}</p>
        </div>
      </div>

      {isFollower ? (
        currentUser?.userCode === param?.userCode ? (
          <button className=' bg-gray-btn-w hover:bg-gray-1 dark:bg-gray-text-w dark:hover:bg-gray-1 rounded-md py-1 px-4 font-semibold '>
            <p>{t('Remove_pf')}</p>
          </button>
        ) : (
          ''
        )
      ) : currentUser?.userCode === param?.userCode ? (
        <button className=' bg-gray-btn-w hover:bg-gray-1 dark:bg-gray-text-w dark:hover:bg-gray-1 rounded-md py-1 px-4 font-semibold '>
          <p onClick={() => handlefolower(follower?.friend?.id)}>
            {t('Following_pf')}
          </p>
        </button>
      ) : (
        ''
      )}
    </div>
  );
};

export default MainModal;
