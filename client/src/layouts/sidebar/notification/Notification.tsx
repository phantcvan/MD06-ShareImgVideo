import { useEffect, useState } from 'react';
import heart from '../../../../src/assets/heart_noti.png';
import { useTranslation } from 'react-i18next';
import { useSelector } from 'react-redux';
import { getCurrentUser } from '../../../stores/slices/userSlice';
import { NotiType } from '../../../constants/type';
import { notiAPI, updateStatusNotiAPI } from '../../../services/user';
import { Link } from 'react-router-dom';
import { PATH } from '../../../services/list-path';
import SingleNoti from './SingleNoti';
interface NotiProp {
  setNewNoti: React.Dispatch<React.SetStateAction<number>>;
}
const Notification = ({ setNewNoti }: NotiProp) => {
  const { t } = useTranslation(['home']);
  const [noti, setNoti] = useState<NotiType[]>([]);
  const currentUser = useSelector(getCurrentUser);

  // Lấy các thông báo thuộc về user
  const fetchNoti = async () => {
    const notiRes: any = await notiAPI(currentUser?.id);
    setNoti(notiRes.reverse());
  };
  // Chuyển các thông báo về chế độ "đã đọc"
  const updateStatusNoti = async () => {
    const updateNoti: any = await updateStatusNotiAPI(currentUser?.id);
    setNewNoti(0);
  };

  useEffect(() => {
    fetchNoti();
    updateStatusNoti();
  }, [currentUser]);
  return (
    <div
      className={`box_shadow animate-slide-right bg-white dark:bg-black dark:border-r dark:border-gray-setting
      overflow-y-auto h-screen`}
    >
      <span className='text-2xl font-semibold ml-6'>{t('noti')}</span>
      {noti.length === 0 ? (
        <div className='flex flex-col gap-5 ml-3'>
          <div className='flex items-center justify-center flex-col mt-6 gap-3'>
            <div className='w-16 overflow-hidden origin-center'>
              <img
                src={heart}
                alt=''
                className='w-16 h-16 overflow-hidden origin-center'
              />
            </div>
            <span>{t('act_on_post')}</span>
            <span className='text-center'>{t('when_sm_like')}</span>
          </div>
        </div>
      ) : (
        <div className='flex flex-col gap-2 mt-6 mx-3'>
          {noti.map((nt, index) => (
            // onClick: mở ModalPost
            <SingleNoti nt={nt} key={index} />
          ))}
        </div>
      )}
    </div>
  );
};

export default Notification;
