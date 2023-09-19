import React from 'react';
import { useTranslation } from 'react-i18next';
import { BiSolidUserAccount } from 'react-icons/bi';
import { FaDatabase } from 'react-icons/fa';
import { MdPermMedia, MdViewKanban } from 'react-icons/md';

interface TotalProp {
  totalUsers: number;
  totalPosts: number;
  totalImgs: number;
  totalVideos: number;
  totalAccess: number;
}
const Total = ({
  totalUsers,
  totalPosts,
  totalImgs,
  totalVideos,
  totalAccess,
}: TotalProp) => {
  const { t } = useTranslation(['admin']);
  return (
    <div className='grid gap-4 sm:grid-cols-1 xl:grid-cols-2 justify-start'>
      <div className='flex flex-1 h-fit rounded-md ad-content gap-3'>
        <p className='p-6 w-[84px] h-[84px] bg-[#B9FFD3] rounded-md'>
          <BiSolidUserAccount size={35} style={{ color: '#22AD56' }} />
        </p>
        <div className='w-[calc(100%-84px)] font-semibold'>
          <div className='border-b w-full border-dashed border-gray-text-b'>
            <p className='text-[#D50000] py-2'>
              {t('total_user').toUpperCase()}
            </p>
          </div>
          <p className='py-2'>
            {totalUsers} {t('user')}
          </p>
        </div>
      </div>
      <div className='flex flex-1 justify-start h-fit rounded-md ad-content gap-3'>
        <p className='w-[84px] h-[84px] bg-[#ADCBF3] rounded-md flex items-center justify-center'>
          <FaDatabase size={30} style={{ color: '#1D5AAB' }} />
        </p>
        <div className='w-[calc(100%-84px)] font-semibold'>
          <div className='border-b border-dashed border-gray-text-b'>
            <p className='text-[#D50000] py-2'>
              {t('total_post').toUpperCase()}
            </p>
          </div>
          <p className='py-2'>
            {totalPosts} {t('post')}
          </p>
        </div>
      </div>
      <div className='flex flex-1 h-fit rounded-md ad-content gap-3'>
        <p className='p-6 w-[84px] h-[84px] bg-[#FDE1C3] rounded-md'>
          <MdPermMedia size={30} style={{ color: '#FF8B07' }} />
        </p>
        <div className='w-[calc(100%-84px)] font-semibold'>
          <div className=' border-b w-full bow-[calc(100%-84px)] font-semiboldrder-dashed border-gray-text-b'>
            <p className='text-[#D50000] py-2'>{t('total_media').toUpperCase()}</p>
          </div>
          <p className='py-2'>
            {totalImgs} {t('img')}, {totalVideos} {t('video')}
          </p>
        </div>
      </div>
      <div className='flex flex-1 h-fit rounded-md ad-content gap-3'>
        <p className='p-6 w-[84px] h-[84px] bg-[#FDC1DA] rounded-md'>
          <MdViewKanban size={30} style={{ color: '#C01F6B' }} />
        </p>
        <div className='w-[calc(100%-84px)] font-semibold'>
          <div className=' border-b w-full border-dashed border-gray-text-b'>
            <p className='text-[#D50000] py-2'>{t('total_access').toUpperCase()}</p>
          </div>
          <p className='py-2'>{totalAccess.toLocaleString()} {t('views')}</p>
        </div>
      </div>
    </div>
  );
};

export default Total;
