import { NavLink, useLocation, useNavigate } from 'react-router-dom';
import { Input } from 'antd';
import { useEffect, useState } from 'react';
import { setLocation } from '../../stores/slices/appSlice';
import { useDispatch } from 'react-redux';
import { useTranslation } from 'react-i18next';
import { registerAPI } from '../../services/user';
import { notiError, notiSuccess } from '../../constants/notification';
import { PATH } from '../../services/list-path';

const Register = () => {
  const { t } = useTranslation(['register']);
  const [email, setEmail] = useState('');
  const [fullName, setFullName] = useState('');
  const [userName, setUserName] = useState('');
  const [password, setPassword] = useState('');
  const location = useLocation();
  const dispatch = useDispatch();
  useEffect(() => {
    const currentPath = location.pathname;
    const setLocationAction = setLocation(currentPath);
    dispatch(setLocationAction);
  }, [location, dispatch]);
  const navigate = useNavigate();

  const handleRegister = async (e: any) => {
    e.preventDefault();
    const emailRegex = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/;
    if (!email || !fullName || !userName || !password) {
      notiError(`${t('blank')}`);
      return;
    } else if (password.length < 5 || password.length > 20) {
      notiError(`${t('password')}`);
      return;
    } else if (!email.match(emailRegex)) {
      notiError(`${t('invalid_email')}`);
      return;
    } else if (/\s/.test(userName) || !/^[\w_]+$/.test(userName)) {
      notiError(`${t('username_cannot')}`);
      return;
    }
    const newUser = {
      email,
      fullName,
      userName,
      password,
    };

    const respone = await registerAPI(newUser);
    if (respone.status === 201) {
      notiSuccess(`${t('Success')}`);
      navigate(PATH.LOGIN);
    } else if (respone.status === 401) {
      notiError(`${t('exist')}`);
    } else {
      notiError(`${t('error')}`);
    }
  };
  return (
    <div className='flex-col flex min-h-[80vh] justify-center items-center'>
      <div className='mx-auto p-4 mb-5'>
        <div className='flex flex-col md:flex-row justify-center gap-4 mb-5'>
          <img
            src='/assets/icon/home-phones-2x.png'
            alt=''
            className='h-[650px] mt-5 hidden md:block object-cover overflow-hidden'
          />
          <div>
            <div className='rounded-md border border-gray-300 w-full md:w-[360px] py-4 px-4 md:px-10'>
              <div className='cursor-pointer flex justify-center mt-2'>
                <img
                  src='/assets/icon/logoInsta.png'
                  alt=''
                  className='w-[200px] h-[60px]'
                />
              </div>
              <form className='flex flex-col gap-4' onSubmit={handleRegister}>
                <div className='text-[rgb(115,115,115)] text-center font-semibold'>
                  <p> {t('Sign_up_to_see_photos_su')}.</p>
                </div>
                <button className='border rounded-lg bg-[rgb(0,149,246)] hover:bg-[rgb(85,169,233)] text-white px-4 py-2 items-center'>
                  <p>{t('Login_facebook_su')}</p>
                </button>
                <div className='flex items-center gap-2 text-[rgb(115,115,115)] justify-center'>
                  <div className='border w-[110px] '></div>
                  <p className='text-gray-500 font-semibold'>{t('or_su')}</p>
                  <div className='border w-[110px] '></div>
                </div>
                <div className='flex flex-col gap-2'>
                  <Input
                    placeholder={t('Number_email_su')}
                    onChange={(e) => setEmail(e.target.value)}
                    className='h-10'
                  />
                  <Input
                    placeholder={t('Full_name_su')}
                    onChange={(e) => setFullName(e.target.value)}
                    className='h-10'
                  />
                  <Input
                    placeholder={t('User_name_su')}
                    onChange={(e) => setUserName(e.target.value)}
                    className='h-10'
                  />
                  <Input
                    placeholder={t('Password_su')}
                    onChange={(e) => setPassword(e.target.value)}
                    type='password'
                    className='h-10'
                  />
                </div>
                <div className='text-[13px] text-gray-500 text-center'>
                  <p>
                    {t('People_su')}.{' '}
                    <span className='text-[rgb(0,55,107)] cursor-pointer'>
                      {t('Learn_more_su')}
                    </span>
                  </p>
                </div>
                <div className='text-[13px] text-gray-500 text-center'>
                  <p>
                    {t('By_signing_up_su')}{' '}
                    <span className='text-[rgb(0,55,107)] cursor-pointer'>
                      {t('Terms_su')}
                    </span>
                    ,{' '}
                    <span className='text-[rgb(0,55,107)] cursor-pointer'>
                      {t('Privacy_Policy_su')}
                    </span>{' '}
                    {t('and_su')}{' '}
                    <span className='text-[rgb(0,55,107)] cursor-pointer'>
                      {t('Cookies_policy_su')}
                    </span>{' '}
                    {t('Out_su')}.
                  </p>
                </div>
                <button className='border rounded-lg bg-[rgb(0,149,246)] hover:bg-[rgb(85,169,233)] opacity-70 hov text-white px-4 py-2'>
                  {t('Signup_su')}
                </button>
              </form>
            </div>
            <div className='flex flex-col justify-center items-center mt-4'>
              <p className='rounded-md border border-gray-300 w-full md:w-[360px] py-4 px-4 md:px-10 text-center'>
                {t('Have_an_account_su')}?{' '}
                <NavLink
                  to={'/login'}
                  className='text-[rgb(0,149,246)] cursor-pointer'
                >
                  {t('Login_su')}
                </NavLink>
              </p>
              <p className='mt-4'>{t('Get_the_app_su')}.</p>
              <div className='flex justify-center items-center mt-4 gap-4'>
                <img
                  src='/assets/icon/googleplay.png'
                  alt=''
                  className='h-[40px]'
                />
                <img
                  src='/assets/icon/microsoft.png'
                  alt=''
                  className='h-[40px]'
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Register;
