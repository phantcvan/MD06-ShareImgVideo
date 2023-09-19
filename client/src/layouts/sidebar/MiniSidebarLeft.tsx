import { SidebarProp } from '../../constants/type';
import Setting from './Setting';
import logo_mini_white from '../../../src/assets/logo-mini-white.png';
import logo_mini_black from '../../../src/assets/logo-mini-black.png';
import { sidebar } from '../../constants/menuSidebar';
import { useTranslation } from 'react-i18next';
import Tippy from '@tippyjs/react/headless';
import { AiOutlineMenu } from 'react-icons/ai';
import { Link } from 'react-router-dom';
import { PATH } from '../../services/list-path';
import Search from './Search';
import Notification from './notification/Notification';
import { useEffect, useRef, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { setPickMenu } from '../../stores/slices/appSlice';
import { BsHeart } from 'react-icons/bs';
import { getCurrentUser } from '../../stores/slices/userSlice';
import { Tooltip } from 'antd';
import { MdOutlineManageAccounts } from 'react-icons/md';

const MiniSidebarLeft = ({
  themeLocal,
  handlePick,
  isPick,
  lngDefault,
  changeLanguage,
  handleChangeMode,
  newNoti,
  setNewNoti,
}: SidebarProp) => {
  const { t } = useTranslation(['home']);
  const divRef = useRef<HTMLDivElement>(null);
  const dispatch = useDispatch();
  const currentUser = useSelector(getCurrentUser);

  const handleOutsideClick = (event: MouseEvent) => {
    if (divRef.current && !divRef.current.contains(event.target as Node)) {
      dispatch(setPickMenu('off'));
    }
  };
  useEffect(() => {
    if (isPick === 'search_sb' || isPick === 'noti_sb') {
      document.addEventListener('mousedown', handleOutsideClick);
    } else {
      document.removeEventListener('mousedown', handleOutsideClick);
    }
    return () => {
      document.removeEventListener('mousedown', handleOutsideClick);
    };
  }, [isPick]);
  return (
    <div
      className='w-[68px] flex items-center justify-between p-2 flex-col fixed top-0 h-full border-r 
      border-gray-1 dark:border-gray-hover-dark bg-white dark:bg-black'
      ref={divRef}
    >
      {/* menu Sidebar */}
      <div className='flex flex-col items-start justify-center w-full'>
        {/* logo */}
        <Link to={PATH.HOME}>
          <div
            className={`w-full my-1 p-[14px] flex items-center cursor-pointer hover:bg-gray-hover 
                      rounded-md dark:hover:bg-gray-hover-dark justify-center`}
            onClick={() => handlePick('home_sb')}
          >
            <img
              src={themeLocal === 'Light' ? logo_mini_white : logo_mini_black}
              className='w-[22px] h-[22px] overflow-hidden object-cover'
            />
          </div>
        </Link>
        {sidebar.map((sb, index) => (
          <Tooltip
            placement='right'
            title={t(`${sb.content}`)}
            color='#3F3F3F'
            key={index}
          >
            <div
              key={index}
              className={`w-full my-1 p-3 flex gap-4 items-center cursor-pointer hover:bg-gray-hover 
                      rounded-md dark:hover:bg-gray-hover-dark justify-center`}
              onClick={() => handlePick(sb.content)}
            >
              <span className={`hover:font-semibold`}>
                {newNoti > 0 && sb.content === `noti_sb` ? (
                  <span className='relative'>
                    <BsHeart size={24} />
                    <div className='absolute top-0 right-[-1px] w-2 h-2 bg-red rounded-full'></div>
                  </span>
                ) : isPick === sb.content ? (
                  <sb.pick size={24} />
                ) : (
                  <sb.icon size={24} />
                )}
              </span>
            </div>
          </Tooltip>
        ))}
        {/* avatar */}
        <Tooltip placement='right' title={t('profile_sb')} color='#3F3F3F'>
          <div
            className={`w-full my-1 p-3 flex gap-4 items-center cursor-pointer hover:bg-gray-hover 
          rounded-md dark:hover:bg-gray-hover-dark justify-center`}
            onClick={() => handlePick('profile_sb')}
          >
            <img
              src={currentUser?.avatar}
              className='rounded-full h-6 w-6 overflow-hidden object-cover'
            />
          </div>
        </Tooltip>
        {/* Trang quản trị */}
        {currentUser?.status >=2 && (
          <Tooltip placement='right' title={t('admin_sb')} color='#3F3F3F'>
            <div
              className={`w-full my-1 p-3 flex gap-4 items-center cursor-pointer hover:bg-gray-hover 
          rounded-md dark:hover:bg-gray-hover-dark justify-center`}
              onClick={() => handlePick('admin_sb')}
            >
              <span className='relative'>
                <MdOutlineManageAccounts size={24} />
              </span>
            </div>
          </Tooltip>
        )}
      </div>
      {/* Setting */}
      <div className='w-full pb-3'>
        <Tippy
          placement='top'
          interactive
          render={(attrs) => (
            <div
              className={`py-1 px-2 h-fit rounded-lg cursor-pointer w-full`}
              {...attrs}
            >
              <Setting
                lngDefault={lngDefault}
                changeLanguage={changeLanguage}
                handleChangeMode={handleChangeMode}
                themeLocal={themeLocal}
              />
            </div>
          )}
        >
          <div
            className={`w-full p-3 flex gap-4 items-center cursor-pointer hover:bg-gray-hover 
              rounded-md dark:hover:bg-gray-hover-dark justify-center`}
          >
            <span className={`hover:font-semibold`}>
              <AiOutlineMenu size={21} />
            </span>
          </div>
        </Tippy>
      </div>
      {isPick === 'search_sb' && <Search />}
      {isPick === 'noti_sb' && <Notification setNewNoti={setNewNoti} />}
    </div>
  );
};

export default MiniSidebarLeft;
