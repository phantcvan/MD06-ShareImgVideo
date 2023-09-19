import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useDispatch, useSelector } from 'react-redux';
import {
  getCreatePost,
  getCurrentWidth,
  getPickMenu,
  setCreatePost,
  setPickMenu,
  setTheme,
} from '../../stores/slices/appSlice';
import '../../index.css';
import { bp, localKey, themeMode } from '../../constants';
import { useNavigate } from 'react-router';
import { PATH } from '../../services/list-path';
import LargeSidebar from './LargeSidebar';
import MiniSidebarLeft from './MiniSidebarLeft';
import { countNotiAPI } from '../../services/user';
import { getCurrentUser } from '../../stores/slices/userSlice';

interface SidebarProp {
  scrollToTop: () => void;
}
const Sidebar = ({ scrollToTop }: SidebarProp) => {
  const { i18n } = useTranslation();
  const isPick = useSelector(getPickMenu);
  const { t } = useTranslation(['home']);
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const curWidth = useSelector(getCurrentWidth) || window.innerWidth;
  const [newNoti, setNewNoti] = useState(0);

  const currentUser = useSelector(getCurrentUser);

  // Đổi ngôn ngữ
  const lngDefault = localStorage.getItem(localKey.lng);
  const changeLanguage = (lng: string) => {
    i18n.changeLanguage(lng);
    localStorage.setItem(localKey.lng, lng);
  };

  // đổi theme mode -> lưu lên localStorage
  const [themeLocal, setThemeLocal] = useState(
    localStorage.getItem(localKey.theme) || themeMode.dark
  );

  const handleChangeMode = (theme: string) => {
    setThemeLocal(theme);
    localStorage.setItem(localKey.theme, theme);
    dispatch(setTheme(theme));
  };

  // Chọn thẻ ở menu
  const handlePick = (menu: string) => {
    // Nếu click icon 2 lần
    if (isPick === menu) {
      const path = window.location.pathname;
      const parts = path.split('/');
      let pathName = path;
      if (parts.length > 0) {
        pathName = parts[1];
      }
      switch (pathName) {
        case PATH.HOME:
          dispatch(setPickMenu('home_sb'));
          scrollToTop();
          break;
        case PATH.EXPLORE:
          dispatch(setPickMenu('explore_sb'));
          break;
        case `${currentUser?.userCode}`:
          dispatch(setPickMenu('profile_sb'));
          break;
        case 'direct':
          dispatch(setPickMenu('messages_sb'));
          break;
        default:
          dispatch(setPickMenu('off'));
          break;
      }
    } else {
      // Nếu click 1 lần
      switch (menu) {
        case 'home_sb':
          dispatch(setPickMenu('home_sb'));
          scrollToTop();
          navigate(PATH.HOME);
          break;
        case 'search_sb':
          dispatch(setPickMenu('search_sb'));
          break;
        case 'explore_sb':
          dispatch(setPickMenu('explore_sb'));
          navigate(PATH.EXPLORE);
          break;
        case 'noti_sb':
          dispatch(setPickMenu('noti_sb'));
          break;
        case 'messages_sb':
          dispatch(setPickMenu('messages_sb'));
          navigate(PATH.INBOX);
          break;
        case 'create_sb':
          dispatch(setCreatePost(true));
          break;
        case 'profile_sb':
          dispatch(setPickMenu('profile_sb'));
          navigate(
            `${PATH.PROFILE.replace(':userCode', currentUser?.userCode)}`
          );
          break;
        case 'admin_sb':
          dispatch(setPickMenu('admin_sb'));
          navigate(PATH.ADMIN);
          break;
        default:
          break;
      }
    }
  };

  // đếm số lượng thông báo mới
  const countNoti = async () => {
    const countNotiRes: any = await countNotiAPI(currentUser?.id);
    const { status, newNoti } = countNotiRes;
    if (status === 200) setNewNoti(newNoti);
  };
  useEffect(() => {
    countNoti();
  }, [currentUser]);
  useEffect(() => {
    dispatch(setTheme(themeLocal));
  }, []);

  const miniList = ['search_sb', 'noti_sb', 'messages_sb'];
  const miniview = miniList.includes(isPick);

  return (
    <div className='relative z-30 bg-white dark:bg-black'>
      {curWidth < bp.md || miniview ? (
        <div className='h-screen flex justify-between border-r border-gray-1 dark:border-gray-hover-dark'>
          <MiniSidebarLeft
            themeLocal={themeLocal}
            handlePick={handlePick}
            isPick={isPick}
            lngDefault={lngDefault}
            changeLanguage={changeLanguage}
            handleChangeMode={handleChangeMode}
            newNoti={newNoti}
            setNewNoti={setNewNoti}
          />
        </div>
      ) : (
        <div className='h-screen flex justify-between border-r border-gray-1 dark:border-gray-hover-dark'>
          <LargeSidebar
            themeLocal={themeLocal}
            handlePick={handlePick}
            isPick={isPick}
            lngDefault={lngDefault}
            changeLanguage={changeLanguage}
            handleChangeMode={handleChangeMode}
            newNoti={newNoti}
            setNewNoti={setNewNoti}
          />
        </div>
      )}
    </div>
  );
};

export default Sidebar;
