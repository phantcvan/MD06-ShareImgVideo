import { useEffect, useState } from 'react';
import { getPickMenu, setPickMenu } from '../../stores/slices/appSlice';
import { useDispatch, useSelector } from 'react-redux';
import Dashboard from './Dashboard';
import PostManage from './PostManage';
import UserManage from './UserManage';
import { getCurrentTime } from '../../constants/fn';
import { localKey } from '../../constants';
import { getCurrentUser } from '../../stores/slices/userSlice';
import { useNavigate } from 'react-router';
import { PATH } from '../../services/list-path';

const Admin = () => {
  const dispatch = useDispatch();
  const pick = useSelector(getPickMenu);
  const [currentTime, setCurrentTime] = useState('');
  const lang = localStorage.getItem(localKey.lng);
  const currentUser = useSelector(getCurrentUser);
  const navigate = useNavigate();

  // update title
  const updateTitle = () => {
    document.title = 'Dashboard ・ Instagram';
  };
  // Thay đổi title của trang và set Pick
  useEffect(() => {
    if (currentUser && currentUser?.status < 2) {
      navigate(PATH.PRIVATE);
    }
    window.scrollTo({ top: 0, behavior: 'smooth' });
    setCurrentTime(getCurrentTime());
    dispatch(setPickMenu('admin_sb'));
    updateTitle();
  }, [currentUser]);
  // Hiển thị thời gian
  useEffect(() => {
    const intervalId = setInterval(() => {
      setCurrentTime(getCurrentTime());
    }, 10000);
    return () => {
      clearInterval(intervalId);
    };
  }, [lang]);

  return (
    <div className=''>
      {pick === 'admin_sb' && currentUser?.status >= 2 ? (
        <Dashboard currentTime={currentTime} />
      ) : pick === 'user_mng_sb' ? (
        <UserManage currentTime={currentTime} />
      ) : (
        pick === 'post_mng_sb' && <PostManage currentTime={currentTime} />
      )}
    </div>
  );
};

export default Admin;
