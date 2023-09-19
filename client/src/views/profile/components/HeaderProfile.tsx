import { Avatar } from 'antd';
import { FiSettings } from 'react-icons/fi';
import { getFollowingAPI, profileAPI } from '../../../services/profile';
import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router';
import ModalFollower from './ModalFollower';
import ModalFollow from './ModalFollow';
import { getFollowerAPI } from '../../../services/profile';
import Album from './Album';
import { PATH } from '../../../services/list-path';
import { UserType } from '../../../constants/type';
import { useDispatch, useSelector } from 'react-redux';
import {
  getCurrentUser,
  getFollows,
  setFollows,
} from '../../../stores/slices/userSlice';
import {
  deleteFollowAPI,
  followAPI,
  profileFollowAPI,
} from '../../../services/follow';
import { useTranslation } from 'react-i18next';
import { createNotiAPI, deleteNotiAPI } from '../../../services/user';
import {
  getFollower,
  getFollowing,
  setFollower,
  setFollowing,
  setPickMenu,
} from '../../../stores/slices/appSlice';
import { createGroupAPI } from '../../../services/message';
import { getPostHome } from '../../../stores/slices/postSlice';

const HeaderProfile = () => {
  const [profile, setProfile] = useState<UserType | undefined>();
  const [isFollowersModalOpen, setIsFollowersModalOpen] = useState(false);
  const [isFollowesModalOpen, setIsFollowesModalOpen] = useState(false);
  const [isFollower, setIsFollower] = useState(true);
  const [isChange, setIsChange] = useState(false);
  const [checkFollower, setCheckFollower] = useState(false);
  const params = useParams();
  const dispatch = useDispatch();
  const { t } = useTranslation(['profile']);
  const navigate = useNavigate();
  const follows = useSelector(getFollows);
  const posts = useSelector(getPostHome);
  const follower = useSelector(getFollower);
  const following = useSelector(getFollowing);

  const getProfile = async (userCode: string) => {
    const response: any = await profileAPI(userCode);
    setProfile(response);
    const { fullName, userName } = response;
    document.title = `${fullName} (@${userName})`;
    dispatch(setPickMenu('profile_sb'));
  };

  // Lấy thông tin user đang đăng nhập
  const user = useSelector(getCurrentUser);

  // Lấy danh sách những người mình theo dõi
  const getFollowers = async (userCode: string) => {
    const follower: any = await getFollowerAPI(userCode);
    // setFollower(follower);
    dispatch(setFollower(follower));
  };

  // Lấy danh sách những người mình theo dõi
  const getFollowings = async (userCode: string) => {
    const following: any = await getFollowingAPI(userCode);
    dispatch(setFollowing(following));
  };

  // Xem danh sách user đã follow hay chưa
  const checkFollow = async (userId: number, profileId: number) => {
    const check: any = await profileFollowAPI(userId, profileId);
    const { status } = check || {};
    if (status === 200) setCheckFollower(true);
  };

  // folow và unfolow
  const handleFollow = async (friend_id: number) => {
    const newFollow = {
      friend_id,
      user_id: user?.id,
      status: 1,
    };
    const newNoti = {
      user_id: friend_id,
      interact_id: user?.id,
      type: 'follow',
      post_id: null,
    };
    if (!checkFollower) {
      const [response, notiRes] = await Promise.all([
        followAPI(newFollow),
        createNotiAPI(newNoti),
      ]);
      if (response?.status === 201) {
        setCheckFollower(true);
        dispatch(setFollows([...follows, friend_id]));
        if (params?.userCode) getFollowers(params?.userCode);
      }
    } else {
      const [response, notiRes] = await Promise.all([
        deleteFollowAPI(user?.id, friend_id),
        deleteNotiAPI(newNoti),
      ]);
      if (response?.status === 200) {
        setCheckFollower(false);
        const newFollow = follows.filter((id: number) => id !== friend_id);
        dispatch(setFollows(newFollow));
        if (params?.userCode) getFollowers(params?.userCode);
      }
    }
  };

  // Nhắn tin
  const handleCreateGroup = async () => {
    const members = { members: `${user?.id}, ${profile?.id}` };
    const response: any = await createGroupAPI(members);
    if (response?.status === 200) {
      navigate(
        `${PATH.MESSAGE.replace(':chatCode', response.group.converCode)}`
      );
    } else if (response?.status === 201) {
      navigate(`${PATH.MESSAGE.replace(':chatCode', response.converCode)}`);
    }
  };

  useEffect(() => {
    const { userCode } = params || {};
    if (userCode) {
      getFollowers(userCode);
      getFollowings(userCode);
    }
  }, [params, isChange]);

  useEffect(() => {
    const { userCode } = params || {};
    if (userCode) {
      getProfile(userCode);
    }
  }, [params]);

  useEffect(() => {
    const { id: profileId } = profile || {};
    const { id: userId } = user || {};
    if (profileId && userId) {
      checkFollow(userId, profileId);
    }
  }, [user, profile]);

  const handleEditProfile = () => {
    navigate(PATH.EDITPROFILE);
  };

  return (
    <div className=' w-full'>
      <div className='flex items-center justify-center gap-40'>
        <Avatar src={profile?.avatar} size={140}>
          {profile?.userName?.slice(0, 1)}
        </Avatar>
        <div className='flex flex-col gap-4'>
          {user?.userCode === params?.userCode ? (
            <div className='flex items-center gap-6'>
              <p className='text-[20px] cursor-pointer'>{profile?.userName}</p>
              <p
                className=' px-4 py-1 rounded bg-[rgb(239,239,239)] hover:bg-[rgb(202,202,202)] dark:bg-gray-text-w dark:hover:bg-[rgb(160,160,160)]  font-semibold cursor-pointer'
                onClick={handleEditProfile}
              >
                {t('edit_pf')}
              </p>
              <p className=' px-4 py-1 rounded bg-[rgb(239,239,239)] hover:bg-[rgb(202,202,202)] dark:bg-gray-text-w dark:hover:bg-[rgb(160,160,160)] font-semibold cursor-pointer'>
                {t('archive_pf')}
              </p>
              <FiSettings size={25} />
            </div>
          ) : (
            <div className='flex items-center gap-6'>
              <p className='text-[20px] cursor-pointer'>{profile?.userName}</p>
              {checkFollower ? (
                <p
                  className=' px-4 py-1 rounded bg-[rgb(239,239,239)] hover:bg-[rgb(202,202,202)] dark:bg-gray-text-w dark:hover:bg-[rgb(160,160,160)]  font-semibold cursor-pointer '
                  onClick={() => profile?.id && handleFollow(profile.id)}
                >
                  {t('Following_pf')}
                </p>
              ) : (
                <p
                  className=' px-4 py-1 rounded bg-[rgb(0,149,246)] hover:bg-[rgb(76,176,242)] dark:bg-[rgb(0,149,246)] dark:hover:bg-[rgb(76,176,242)]  font-semibold cursor-pointer text-white'
                  onClick={() => profile?.id && handleFollow(profile.id)}
                >
                  {t('Follow_pf')}
                </p>
              )}

              <p
                className=' px-4 py-1 rounded bg-[rgb(239,239,239)] hover:bg-[rgb(202,202,202)] dark:bg-gray-text-w dark:hover:bg-[rgb(160,160,160)]  font-semibold cursor-pointer'
                onClick={handleCreateGroup}
              >
                {t('Mess_pf')}
              </p>
              <FiSettings size={25} />
            </div>
          )}

          <div className='flex items-center gap-10'>
            <p>
              <b>{posts?.length}</b> {t('post_pf')}
            </p>
            <p
              className='cursor-pointer'
              onClick={() => setIsFollowersModalOpen(true)}
            >
              <b>{follower?.follower?.length}</b> {t('followers_pf')}
            </p>

            <p
              className='cursor-pointer'
              onClick={() => setIsFollowesModalOpen(true)}
            >
              {t('following_pf')} <b>{following?.following?.length}</b>{' '}
              {t('followers_pf1')}
            </p>
            {isFollowesModalOpen && (
              <ModalFollow
                isFollower={!isFollower}
                following={following?.following}
                isFollowesModalOpen={isFollowesModalOpen}
                setIsFollowesModalOpen={setIsFollowesModalOpen}
                setIsChange={setIsChange}
              />
            )}
            {isFollowersModalOpen && (
              <ModalFollower
                isFollowersModalOpen={isFollowersModalOpen}
                setIsFollowersModalOpen={setIsFollowersModalOpen}
                follower={follower?.follower}
                isFollower={isFollower}
              />
            )}
          </div>

          <div className='flex flex-col'>
            <p className='font-semibold'>{profile?.fullName}</p>
            <p> {profile?.bio}</p>
          </div>
        </div>
      </div>
      <Album />
    </div>
  );
};

export default HeaderProfile;
