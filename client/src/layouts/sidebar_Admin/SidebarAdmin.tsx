import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
  getCurrentWidth,
  getPickMenu,
  setPickMenu,
  setTheme,
} from '../../stores/slices/appSlice';
import { sidebarAdmin } from '../../constants/menuSidebar';
import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';
import { bp, localKey, themeMode } from '../../constants';
import { PATH } from '../../services/list-path';
import logo_white from '../../../src/assets/logo-white.png';
import logo_black from '../../../src/assets/logo-black.png';
import logo_mini_white from '../../../src/assets/logo-mini-white.png';
import logo_mini_black from '../../../src/assets/logo-mini-black.png';
import { AiOutlineMenu } from 'react-icons/ai';
import Tippy from '@tippyjs/react/headless';
import Setting from '../sidebar/Setting';
import { Tooltip } from 'antd';
import '../../index.css';

const SidebarAdmin = () => {
  const curWidth = useSelector(getCurrentWidth) || window.innerWidth;
  const { i18n } = useTranslation();
  const isPick = useSelector(getPickMenu);
  const { t } = useTranslation(['admin']);
  const [themeLocal, setThemeLocal] = useState(
    localStorage.getItem(localKey.theme) || themeMode.dark
  );
  
  const lngDefault = localStorage.getItem(localKey.lng);
  const dispatch = useDispatch();

  const changeLanguage = (lng: string) => {
    i18n.changeLanguage(lng);
    localStorage.setItem(localKey.lng, lng);
  };
  const [showTooltip, setShowTooltip] = useState(true);

  const handleChangeMode = (theme: string) => {
    setThemeLocal(theme);
    localStorage.setItem(localKey.theme, theme);
    dispatch(setTheme(theme));
  };

  const handlePick = (pick: string) => {
    dispatch(setPickMenu(pick));
  };
  return (
    <div className='relative z-10 bg-white dark:bg-black'>
      <div
        className='md:w-[244px] sm:w-[68px] w-[68px] flex items-start justify-between p-2 flex-col border-r border-gray-1 h-full
     dark:border-gray-hover-dark fixed top-0 bg-white dark:bg-black'
      >
        <div>
          {curWidth >= bp.sm ? (
            <Link to={PATH.HOME}>
              <div className='h-[30px] overflow-hidden object-cover mb-1 pt-6 px-3 pb-8 w-fit cursor-pointer'>
                <img
                  src={themeLocal === 'Light' ? logo_white : logo_black}
                  className='w-[103px] h-[30px] overflow-hidden object-cover'
                />
              </div>
            </Link>
          ) : (
            <Link to={PATH.HOME}>
              <div
                className={`w-full p-[14px] flex items-center cursor-pointer hover:bg-gray-hover 
                      rounded-md dark:hover:bg-gray-hover-dark justify-center`}
                onClick={() => handlePick('home_sb')}
              >
                <img
                  src={
                    themeLocal === 'Light' ? logo_mini_white : logo_mini_black
                  }
                  className='w-[22px] h-[22px] overflow-hidden object-cover'
                />
              </div>
            </Link>
          )}
          {sidebarAdmin.map((sb, index) => (
            <Tooltip
              placement='right'
              title={t(`${sb.content}`)}
              color='#3F3F3F'
              key={index}
              className={showTooltip ? '' : 'ant-tooltip'}
            >
              <div
                key={index}
                className={`w-full p-3 flex gap-4 items-center cursor-pointer hover:bg-gray-hover 
            rounded-md dark:hover:bg-gray-hover-dark`}
                onClick={() => handlePick(sb.content)}
              >
                <span className={`hover:font-semibold`}>
                  {isPick === sb.content ? (
                    <sb.pick size={24} />
                  ) : (
                    <sb.icon size={24} />
                  )}
                </span>
                {curWidth >= bp.sm && (
                  <span
                    className={`hover:font-semibold ${
                      isPick === sb.content && 'font-bold'
                    }`}
                  >
                    {t(sb.content)}
                  </span>
                )}
              </div>
            </Tooltip>
          ))}
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
              {curWidth >= bp.sm && (
                <span
                  className={`hover:font-semibold ${
                    isPick === 'setting_sb' && 'font-bold'
                  }`}
                >
                  {t('setting_sb')}
                </span>
              )}
            </div>
          </Tippy>
        </div>
      </div>
    </div>
  );
};

export default SidebarAdmin;
