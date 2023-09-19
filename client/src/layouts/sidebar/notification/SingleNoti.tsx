import { useEffect, useState } from 'react';
import { NotiType } from '../../../constants/type';
import { useTranslation } from 'react-i18next';
import {
  checkFollowAPI,
  createFollowAPI,
  createNotiAPI,
  deleteNotiAPI,
  deleteFollowAPI,
} from '../../../services/user';
import { useDispatch, useSelector } from 'react-redux';
import {
  getCurrentUser,
  getFollows,
  setFollows,
} from '../../../stores/slices/userSlice';
import instagram from '../../../assets/instagram.png';
import moment from 'moment';
import { setShowPostManage } from '../../../stores/slices/appSlice';
import { createGroupAPI } from '../../../services/message';
import { useNavigate } from 'react-router';
import { PATH } from '../../../services/list-path';

interface SingleProp {
  nt: NotiType;
}
const SingleNoti = ({ nt }: SingleProp) => {
  const { t } = useTranslation(['home']);
  const [isFollow, setIsFollow] = useState(false);
  const currentUser = useSelector(getCurrentUser);
  const follows = useSelector(getFollows);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  // ShowModal
  const handleShowPost = (code: string) => {
    if (code) dispatch(setShowPostManage(code));
  };

  // Follow bạn khi click btn
  const handleFollow = async () => {
    // follow
    const data = {
      user_id: currentUser?.id,
      friend_id: nt?.interactUser?.id,
      status: 1,
    };
    const newNoti = {
      user_id: nt?.interactUser?.id,
      interact_id: currentUser?.id,
      type: 'follow',
      post_id: null,
    };

    if (!isFollow) {
      // gửi thông báo cho người được follow
      const [followRes, notiRes] = await Promise.all([
        createFollowAPI(data),
        createNotiAPI(newNoti),
      ]);
      if (followRes.status !== 404) {
        setIsFollow(true);
        const newFollowArr = [...follows, nt?.interactUser?.id];
        dispatch(setFollows(newFollowArr));
      }
    } else {
      // xoá follow và notification
      const [deleteFollowRes, notiRes] = await Promise.all([
        deleteFollowAPI(currentUser?.id, nt?.interactUser?.id),
        deleteNotiAPI(newNoti),
      ]);
      if (deleteFollowRes.status === 200) {
        setIsFollow(false);
        const newFollowArr = follows.filter(
          (id: number) => id !== nt?.interactUser?.id
        );
        dispatch(setFollows(newFollowArr));
      }
    }
  };
  // Kiểm tra xem đã follow nhau chưa
  const checkIsFollow = async () => {
    const checkRes: any = await checkFollowAPI(
      currentUser?.id,
      nt?.interactUser?.id
    );
    if (checkRes.status === 200) setIsFollow(true);
    else setIsFollow(false);
  };

  useEffect(() => {
    checkIsFollow();
  }, [currentUser]);
  // Hiển thị kiểu thông báo
  const typeNoti: any = {
    like: 'like_noti',
    follow: 'follow_noti',
    comment: 'comment_noti',
    lock: 'lock_noti',
  };
  const handleContact = async () => {
    const members = { members: `${currentUser?.id}, 20` };
    const response: any = await createGroupAPI(members);
    const { status } = response || {};
    if (status === 200) {
      navigate(
        `${PATH.MESSAGE.replace(':chatCode', response.group.converCode)}`
      );
    } else if (response?.status === 201) {
      navigate(`${PATH.MESSAGE.replace(':chatCode', response.converCode)}`);
    }
  };

  return (
    <div
      key={nt?.id}
      className={`flex gap-3 items-center w-full cursor-pointer hover:bg-gray-hover-w p-3 rounded-md
  dark:hover:bg-gray-hover-b ${nt?.status === 1 && 'font-semibold'}`}
    >
      <div className='flex justify-between items-center'>
        {nt?.type === 'lock' ? (
          <img
            src={instagram}
            alt=''
            className='w-[44px] h-[44px] overflow-hidden object-cover'
          />
        ) : (
          <img
            src={nt?.interactUser?.avatar}
            alt=''
            className='w-[44px] h-[44px] overflow-hidden object-cover rounded-full'
          />
        )}
        <div className='flex flex-1'>
          <span
            className='inline ml-3'
            onClick={
              nt?.postCode
                ? () => handleShowPost(nt?.postCode || '')
                : nt.type === 'lock'
                ? handleContact
                : undefined
            }
          >
            <span className='font-semibold'>
              {(nt?.type !== 'lock' && nt?.interactUser?.userName) || ''}{' '}
            </span>
            <span className=''>
              {t(`${typeNoti[nt?.type]}`)}
              {'. '}
            </span>
            <span className='text-gray-text-w dark:text-gray-text-b text-sm'>
              {moment(nt.date).fromNow(true)}
            </span>
          </span>
        </div>
      </div>
      {nt?.type === 'follow' && (
        <div
          className='min-w-fit rounded-md bg-gray-btn-w hover:bg-gray-1 dark:bg-gray-setting flex
    dark:hover:bg-gray-setting items-center justify-center p-2 font-semibold'
          onClick={handleFollow}
        >
          {isFollow ? `${t('following')}` : `${t('follow')}`}
        </div>
      )}
    </div>
  );
};

export default SingleNoti;
