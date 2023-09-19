import { useTranslation } from 'react-i18next';
import { notiError } from '../../../../constants/notification';

interface ChangeAvatarProp {
  setSelectedImg: React.Dispatch<React.SetStateAction<File | null>>;
  setImgUrl: any;
  setIsChange: React.Dispatch<React.SetStateAction<boolean>>;
}
const ChangeAvatar = ({
  setSelectedImg,
  setImgUrl,
  setIsChange,
}: ChangeAvatarProp) => {
  const { t } = useTranslation(['profile']);

  const handleImgChange = (event: any) => {
    const ImgFileArr = event.target.files[0].name.split('.');
    const typeOfImg = ImgFileArr[ImgFileArr.length - 1].toLowerCase();
    if (
      typeOfImg === 'png' ||
      typeOfImg === 'jpg' ||
      typeOfImg === 'jpeg' ||
      typeOfImg === 'bmp'
    ) {
      setSelectedImg(event.target.files[0]);
      const file = event.target.files[0];
      const reader = new FileReader();
      reader.onload = () => {
        setImgUrl(reader?.result);
        setIsChange(true);
      };
      if (file) {
        reader.readAsDataURL(file);
      }
    } else {
      notiError(t('img_format_wrong'));
      setSelectedImg(null);
    }
  };
  return (
    <div>
      <label
        htmlFor='avatar'
        className={`text-blue-chat cursor-pointer mx-1 mb-2`}
      >
        <span>{t('change_pf_photo')}</span>
      </label>
      <input
        type='file'
        name='avatar'
        id='avatar'
        required
        className='hidden'
        onChange={handleImgChange}
      />
    </div>
  );
};

export default ChangeAvatar;
