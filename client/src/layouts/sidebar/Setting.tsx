import '../../index.css';
import { langMode, localKey, themeMode } from '../../constants';
import { useTranslation } from 'react-i18next';
import { useDispatch } from 'react-redux';
import { setCurrentUser } from '../../stores/slices/userSlice';
import { useNavigate } from 'react-router';
import { PATH } from '../../services/list-path';
import { Switch, Space } from 'antd';
import './Sidebar.css';

interface SettingProp {
  lngDefault: string | null;
  changeLanguage: (lng: string) => void;
  handleChangeMode: (theme: string) => void;
  themeLocal: string;
}
const Setting = ({
  lngDefault,
  changeLanguage,
  handleChangeMode,
  themeLocal,
}: SettingProp) => {
  const { t } = useTranslation(['home']);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const handleLogout = () => {
    dispatch(setCurrentUser(null));
    localStorage.removeItem(localKey.token);
    navigate(PATH.LOGIN);
  };
  return (
    <div className={`box_shadow_setting bg-white dark:bg-gray-setting`}>
      <div
        className='item_setting hover:bg-gray-hover dark:hover:bg-gray-hover-dark py-1'
        // onClick={() =>
        //   changeLanguage(lngDefault === langMode.en ? langMode.vi : langMode.en)
        // }
      >
        <span>{t('lang')}</span>
        <Space direction='vertical'>
          <Switch
            checkedChildren={langMode.en.toUpperCase()}
            unCheckedChildren={langMode.vi.toUpperCase()}
            className='bg-blue'
            defaultChecked={lngDefault === langMode.en}
            onClick={() =>
              changeLanguage(
                lngDefault === langMode.en ? langMode.vi : langMode.en
              )
            }
          />
        </Space>
      </div>
      <div
        className='item_setting hover:bg-gray-hover dark:hover:bg-gray-hover-dark'
        // onChange={() =>
        //   handleChangeMode(
        //     themeLocal === themeMode.light ? themeMode.dark : themeMode.light
        //   )
        // }
      >
        <span>{t('switch_mode')}</span>
        <span className='cursor-pointer rounded-full py-1'>
          <label className='ui-switch'>
            <input
              type='checkbox'
              checked={themeLocal === themeMode.light}
              onChange={() =>
                handleChangeMode(
                  themeLocal === themeMode.light
                    ? themeMode.dark
                    : themeMode.light
                )
              }
            />

            <div
              className={`slider ${
                themeLocal === themeMode.light ? 'light-theme' : 'dark-theme'
              }`}
            >
              <div className='circle' />
            </div>
          </label>
        </span>
      </div>
      <div
        className='item_setting hover:bg-gray-hover dark:hover:bg-gray-hover-dark'
        onClick={handleLogout}
      >
        <span className='cursor-pointer rounded-full py-2'>{t('log_out')}</span>
      </div>
    </div>
  );
};

export default Setting;
