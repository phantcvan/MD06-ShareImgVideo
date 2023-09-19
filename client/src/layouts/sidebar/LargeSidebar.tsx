import logo_white from '../../../src/assets/logo-white.png';
import logo_black from '../../../src/assets/logo-black.png';
import { sidebar } from '../../constants/menuSidebar';
import { useTranslation } from 'react-i18next';
import Tippy from '@tippyjs/react/headless';
import { AiOutlineMenu } from 'react-icons/ai';
import { SidebarProp } from '../../constants/type';
import Setting from './Setting';
import { Link } from 'react-router-dom';
import { PATH } from '../../services/list-path';
import '../../index.css';
import { BsHeart } from 'react-icons/bs';
import { useSelector } from 'react-redux';
import { getCurrentUser } from '../../stores/slices/userSlice';
import { MdOutlineManageAccounts } from 'react-icons/md';

const LargeSidebar = ({
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
  const currentUser = useSelector(getCurrentUser);

  return (
    <div
      className='w-[244px] flex items-center justify-between px-2 flex-col border-r border-gray-1 h-full
     dark:border-gray-hover-dark fixed top-0 bg-white dark:bg-black'
    >
      {/* menu Sidebar */}
      <div className='flex flex-col items-start w-full'>
        {/* logo */}
        <div onClick={() => handlePick('home_sb')}>
          <div className='h-[30px] my-1 overflow-hidden object-cover mb-1 pt-6 px-3 pb-8 w-fit cursor-pointer'>
            <img
              src={themeLocal === 'Light' ? logo_white : logo_black}
              className='w-[103px] h-[30px] overflow-hidden object-cover'
            />
          </div>
        </div>
        {sidebar.map((sb, index) => (
          <div
            key={index}
            className={`w-full my-1 p-3 flex gap-4 items-center cursor-pointer hover:bg-gray-hover 
            rounded-md dark:hover:bg-gray-hover-dark`}
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
            <span
              className={`hover:font-semibold ${
                isPick === sb.content && 'font-bold'
              }`}
            >
              {t(sb.content)}
            </span>
          </div>
        ))}
        {/* avatar */}
        <div
          className={`w-full my-1 p-3 flex gap-4 items-center cursor-pointer hover:bg-gray-hover 
          rounded-md dark:hover:bg-gray-hover-dark`}
          onClick={() => handlePick('profile_sb')}
        >
          <img
            src={currentUser?.avatar}
            className='rounded-full h-6 w-6 overflow-hidden object-cover'
          />
          <span className={`hover:font-semibold `}>{t('profile_sb')}</span>
        </div>
        {/* Trang quản trị */}
        {currentUser?.status >= 2 && (
          <div
            className={`w-full my-1 p-3 flex gap-4 items-center cursor-pointer hover:bg-gray-hover 
          rounded-md dark:hover:bg-gray-hover-dark`}
            onClick={() => handlePick('admin_sb')}
          >
            <span className='relative'>
              <MdOutlineManageAccounts size={24} />
            </span>
            <span className={`hover:font-semibold `}>{t('admin_sb')}</span>
          </div>
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
              rounded-md dark:hover:bg-gray-hover-dark`}
          >
            <span className={`hover:font-semibold`}>
              <AiOutlineMenu size={21} />
            </span>
            <span
              className={`hover:font-semibold ${
                isPick === 'setting_sb' && 'font-bold'
              }`}
            >
              {t('setting_sb')}
            </span>
          </div>
        </Tippy>
      </div>
    </div>
  );
};

export default LargeSidebar;
