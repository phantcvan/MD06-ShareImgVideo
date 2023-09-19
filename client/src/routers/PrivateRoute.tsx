import { Outlet, useNavigate } from 'react-router';
import { useDispatch, useSelector } from 'react-redux';
import { useEffect, useState } from 'react';
import { setCurrentUser } from '../stores/slices/userSlice';
import Sidebar from '../layouts/sidebar/Sidebar';
import {
  getCreatePost,
  getPickMenu,
  getShowPostManage,
  setCurrentWidth,
} from '../stores/slices/appSlice';
import { authAPI } from '../services/auth';
import '../index.css';
import { PATH } from '../services/list-path';
import { localKey } from '../constants';
import { useTranslation } from 'react-i18next';
import { UserType } from '../constants/type';
import SidebarAdmin from '../layouts/sidebar_Admin/SidebarAdmin';
import { updateAccessAPI } from '../services/user';
import moment from 'moment';
import Post from '../views/admin/components/Post';
import CreatePost from '../layouts/post/CreatePost';

const PrivateRoute = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const isPick = useSelector(getPickMenu);
  const { t } = useTranslation(['home']);
  const pickMess = 'messages_sb' === isPick;
  const [userNow, setUserNow] = useState<UserType | null>();
  const [role, setRole] = useState(0);
  const showPost = useSelector(getShowPostManage);

  // lưu độ rộng màn hình vào toolkit
  const setWidth = (e: any) => {
    dispatch(setCurrentWidth(e.target.innerWidth));
  };
  useEffect(() => {
    window.addEventListener('resize', setWidth);
    return () => {
      window.removeEventListener('resize', setWidth);
    };
  }, []);
  // nếu có token ở local-> cho phép đăng nhập tự động
  const fetchDataUsers = async () => {
    const token = localStorage.getItem(localKey.token);
    if (token) {
      const usersResponse: any = await authAPI();
      const { status, user } = usersResponse || {};
      if (status === 200) {
        const today = new Date();
        const month = moment(today).format('YYYY-MM');
        const data = {
          month,
        };
        const accessResponse: any = await updateAccessAPI(data);
        dispatch(setCurrentUser(user));
        setUserNow(user);
        setRole(user.status);
        return;
      } else {
        localStorage.removeItem(localKey.token);
        navigate(PATH.LOGIN);
      }
    } else {
      navigate(PATH.LOGIN);
    }
  };

  const createPost = useSelector(getCreatePost);
  useEffect(() => {
    fetchDataUsers();
  }, []);

  const menuAdmin = ['admin_sb', 'user_mng_sb', 'post_mng_sb'];
  const scrollToTop = () => {
    const content = document.querySelector('.home');
    if (content !== null) {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  return (
    <div className='flex w-full bg-white min-h-screen dark:text-white dark:bg-black duration-100'>
      {role >= 2 && menuAdmin.includes(isPick) ? (
        <SidebarAdmin />
      ) : (
        <Sidebar scrollToTop={scrollToTop} />
      )}
      <div
        className={`${pickMess ? 'ml-20' : 'sm:ml-20 lg:ml-60 ml-20'} w-[100%]`}
      >
        <Outlet />
      </div>
      {createPost && <CreatePost />}
      {showPost && <Post />}
    </div>
  );
};

export default PrivateRoute;
