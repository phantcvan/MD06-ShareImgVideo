import { Button } from 'antd';
import { useTranslation } from 'react-i18next';
import { notiError } from '../../constants/notification';
import { useDispatch, useSelector } from 'react-redux';
import { getTheme } from '../../stores/slices/appSlice';
import { setStep } from '../../stores/slices/postSlice';

const AddMedia = ({ setFileMedia, setImgUrl }: any) => {
  const { t } = useTranslation(['post']);
  const theme = useSelector(getTheme);
  const dispatch = useDispatch();

  const handleImageChange = async (event: any) => {
    const files = event.target.files;
    setFileMedia(files);
    const ImgFileArr = event.target.files[0].name.split('.');
    const typeOfImg = ImgFileArr[ImgFileArr.length - 1].toLowerCase();
    if (
      typeOfImg === 'png' ||
      typeOfImg === 'jpg' ||
      typeOfImg === 'jpeg' ||
      typeOfImg === 'bmp' ||
      typeOfImg === 'mp4'
    ) {
      const file = event.target.files[0];
      const reader: any = new FileReader();
      reader.onload = () => {
        setImgUrl(reader.result);
      };
      if (file) {
        reader.readAsDataURL(file);
      }
      dispatch(setStep(2));
    } else {
      notiError(`${t('file_p')}`);
    }
  };
  return (
    <div className='bg-white fixed top-[20%] min-h-[400px] h-2/3 w-1/3 z-50 left-1/3 rounded-lg flex flex-col dark:bg-black'>
      <div className='border-b border-gray-1 w-[100%] text-center font-semibold py-3 h-[10%] items-center'>
        {t('create_p')}
      </div>{' '}
      <div className='h-[90%] text-center items-center flex flex-col justify-center gap-5'>
        {theme === 'Dark' ? (
          <img
            src='/assets/icon/img.png'
            alt=''
            width={150}
            height={150}
            className='object-cover overflow-hidden'
          />
        ) : (
          <img
            src='/assets/icon/media.jpg'
            alt=''
            width={150}
            height={150}
            className='object-cover overflow-hidden'
          />
        )}
        <Button type='primary' className='bg-[rgb(0,149,246)] font-semibold'>
          <label htmlFor='fileInput'>{t('select_p')}</label>
        </Button>
        <input
          type='file'
          multiple
          hidden
          id='fileInput'
          onChange={handleImageChange}
        />
      </div>
    </div>
  );
};

export default AddMedia;
