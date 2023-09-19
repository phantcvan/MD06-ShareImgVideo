import React from 'react';
import { RiMessengerLine } from 'react-icons/ri';
import { useSelector } from 'react-redux';
import { getTheme } from '../../../stores/slices/appSlice';
import mess_w from '../../../assets/mess_w.png';
import mess_b from '../../../assets/mess_b.png';
import { useTranslation } from 'react-i18next';

interface IntroProp {
  setOpenSendMess: React.Dispatch<React.SetStateAction<boolean>>;
}
const Intro = ({ setOpenSendMess }: IntroProp) => {
  const theme = useSelector(getTheme);
  const { t } = useTranslation(['message']);

  const handleOpenSendMess = () => {
    setOpenSendMess(true);
  };
  return (
    <div
      className='md:border-l border-gray-1 dark:border-gray-setting w-full flex flex-col items-center 
    justify-center h-screen gap-3'
    >
      <div className='rounded-full border-2 p-2'>
        <img
          src={theme === 'Light' ? mess_w : mess_b}
          alt=''
          className='p-3 w-20 h-20'
        />
      </div>
      <span className='text-lg'>{t('your_mess')}</span>
      <span className='text-gray-text-w'>{t('send_mess_intro')}</span>
      <div
        className='bg-[#0095F6] hover:bg-[#1877F2] text-white py-2 px-4 rounded-lg cursor-pointer mt-2'
        onClick={handleOpenSendMess}
      >
        {t('send_mess')}
      </div>
    </div>
  );
};

export default Intro;
