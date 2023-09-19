import { NavLink, useLocation, useNavigate } from 'react-router-dom';
import { AiFillFacebook } from 'react-icons/ai';
import { Input } from 'antd';
import { useTranslation } from 'react-i18next';
import { useDispatch } from 'react-redux';
import { setLocation } from '../../stores/slices/appSlice';
import { useEffect, useState } from 'react';
import { notiError, notiSuccess } from '../../constants/notification';
import { setCurrentUser } from '../../stores/slices/userSlice';
import { localKey } from '../../constants';
import { SigninAPI } from '../../services/user';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();

  const { t } = useTranslation(['login']);

  // Nếu đã có token thì sẽ chuyển về trang home
  useEffect(() => {
    const token = localStorage.getItem(localKey.token);
    if (token) {
      navigate('/');
    }
  }, []);

  // Lắng nghe đường dẫn để sử dụng footer
  const location = useLocation();
  const dispatch = useDispatch();
  useEffect(() => {
    const currentPath = location.pathname;
    const setLocationAction = setLocation(currentPath);
    dispatch(setLocationAction);
  }, [location, dispatch]);

  // Hàm xử lý để đăng nhập
  const handleLogin = async (e: any) => {
    e.preventDefault();
    const newUser = {
      email,
      password,
    };
    const response: any = await SigninAPI(newUser);
    const { status, access_token, user } = response || {};
    if (status === 400) {
      notiError(`${t('user_correct_lg')}!`);
    } else if (status === 200) {
      dispatch(setCurrentUser(user));
      localStorage.setItem(localKey.token, access_token);
      notiSuccess(`${t('user_success_lg')}!`);
      setTimeout(() => {
        navigate('/');
      }, 1000);
      const setLocationAction = setLocation(false);
      dispatch(setLocationAction);
    }
  };
  return (
    <div className='flex-col flex min-h-[90vh] justify-center items-center'>
      <div className='mx-auto p-4 mb-5'>
        <div className='flex flex-col md:flex-row justify-center gap-4 mb-5'>
          <img
            src='/assets/icon/home-phones-2x.png'
            alt=''
            className='h-[500px] hidden md:block'
          />
          <div>
            <div className='rounded-md border w-full md:w-[360px] py-4 px-4 md:px-10'>
              <div className='cursor-pointer flex justify-center mt-2 mb-5'>
                <img
                  src='/assets/icon/logoInsta.png'
                  alt=''
                  className='w-[200px] h-[60px]'
                />
              </div>
              <form className='flex flex-col gap-4' onSubmit={handleLogin}>
                <div className='flex flex-col gap-2'>
                  <Input
                    placeholder={t('email_lg')}
                    className='h-10'
                    onChange={(e) => setEmail(e.target.value)}
                  />
                  <Input
                    placeholder={t('password_lg')}
                    className='h-10'
                    onChange={(e) => setPassword(e.target.value)}
                    type='password'
                  />
                </div>
                <button className='border rounded-lg bg-[rgb(0,149,246)] hover:bg-[rgb(85,169,233)] text-white px-4 py-2 items-center'>
                  {t('log_in_lg')}
                </button>
                <div className='flex items-center gap-2 text-[rgb(115,115,115)] justify-center'>
                  <div className='border w-[110px] h-0'></div>
                  <p className='text-gray-500 font-semibold'>{t('or_lg')}</p>
                  <div className='border w-[110px] h-0'></div>
                </div>
                <div className=' flex items-center gap-2 text-[#385185] justify-center'>
                  <p className='text-sm cursor-pointer '>
                    <AiFillFacebook size={21} />
                  </p>
                  <p className='cursor-pointer text-[#385185] font-semibold'>
                    {t('login_fb_lg')}
                  </p>
                </div>
                <div className='text-[rgb(0,55,107)] cursor-pointer text-center font-normal text-sm'>
                  {t('forgot_lg')}?
                </div>
              </form>
            </div>
            <div className='flex flex-col justify-center items-center mt-4'>
              <p className='rounded-md border border-gray-300 w-full md:w-[360px] py-4 px-4 md:px-10 text-center'>
                {t('account_lg')}?{' '}
                <NavLink
                  to={'/register'}
                  className='text-[rgb(0,149,246)] cursor-pointer'
                >
                  {t('sign_up_lg')}
                </NavLink>
              </p>
              <p className='mt-4'>{t('get_app_lg')}.</p>
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

export default Login;
