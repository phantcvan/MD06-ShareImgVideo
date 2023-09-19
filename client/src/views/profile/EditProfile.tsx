import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { getCurrentUser, setCurrentUser } from '../../stores/slices/userSlice';
import { useTranslation } from 'react-i18next';
import '../../index.css';
import type { RadioChangeEvent } from 'antd';
import ChangeGender from './components/edit-profile/ChangeGender';
import ChangePassword from './components/edit-profile/ChangePassword';
import { Input } from 'antd';
import { updateProfileAPI } from '../../services/user';
import axios from 'axios';
import { notiError, notiSuccess } from '../../constants/notification';
import { setLoading } from '../../stores/slices/appSlice';
import ChangeAvatar from './components/edit-profile/ChangeAvatar';
import { useNavigate } from 'react-router';
import { PATH } from '../../services/list-path';
// import { getUserAPI } from '../../services/user';

const EditProfile = () => {
  const currentUser = useSelector(getCurrentUser);
  const [pick, setPick] = useState('edit');
  const [isChange, setIsChange] = useState(false);
  const [avatarView, setAvatarView] = useState('');
  const [fullName, setFullName] = useState('');
  const [bio, setBio] = useState('');
  const [bioCount, setBioCount] = useState(0);
  const [gender, setGender] = useState(0);
  const [openModalChangeGender, setOpenModalChangeGender] = useState(false);
  const [openModalChangePass, setOpenModalChangePass] = useState(false);
  const { t } = useTranslation(['profile']);
  const dispatch = useDispatch();
  const [selectedImg, setSelectedImg] = useState<File | null>(null);
  const [imgUrl, setImgUrl] = useState('');
  const navigate = useNavigate();
  // update title
  const updateTitle = () => {
    document.title = 'Edit profile ・ Instagram';
  };
  // Lấy về dữ liệu cũ của người dùng
  useEffect(() => {
    updateTitle();
    setBio(currentUser?.bio);
    setBioCount(currentUser?.bio?.length || 0);
    setGender(currentUser?.gender);
    setAvatarView(currentUser?.avatar);
    setFullName(currentUser?.fullName);
  }, [currentUser]);
  // chọn mục chỉnh sửa
  const handlePick = (pick: string) => {
    setPick(pick);
    if (pick === 'pass') setOpenModalChangePass(true);
  };
  // Thay đổi tiểu sử
  const handleChangeBio = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const inputBio = e.target.value.replace(/\s+/g, ' ');
    if (inputBio !== ' ') {
      setIsChange(true);
      setBio(e.target.value);
      setBioCount(e.target.value.length);
    }
  };
  const handleChangeName = (e: React.ChangeEvent<HTMLInputElement>) => {
    const input = e.target.value.replace(/\s+/g, ' ');
    if (input !== ' ') {
      setIsChange(true);
      setFullName(e.target.value);
    }
  };
  // Thay đổi giới tính
  const showModalGender = () => {
    setOpenModalChangeGender(true);
  };
  const handleCancelGender = () => {
    setOpenModalChangeGender(false);
  };
  const onChangeGender = (e: RadioChangeEvent) => {
    console.log('ONCHANGE', e.target.value);

    setIsChange(true);
    setGender(e.target.value);
  };
  // Thay đổi password
  const handleCancelPassword = () => {
    setOpenModalChangePass(false);
    setPick('edit');
  };

  const handleSubmit = async () => {
    let newAvatar = currentUser?.avatar;
    if (selectedImg) {
      const formData = new FormData();
      formData.append('file', selectedImg);
      formData.append('upload_preset', 'instagram');
      dispatch(setLoading(true));
      try {
        const uploadImg = await axios.post(
          'https://api.cloudinary.com/v1_1/dbs47qbrd/image/upload',
          formData
        );
        dispatch(setLoading(false));
        newAvatar = uploadImg.data.secure_url;
      } catch (error) {
        dispatch(setLoading(false));
        console.error('Error uploading cover:', error);
      }
    }
    if (
      fullName !== currentUser?.fullName ||
      bio !== currentUser?.bio ||
      gender !== currentUser?.gender ||
      newAvatar !== 'currentUser?.avatar'
    ) {
      const newProfile = {
        id: currentUser?.id,
        fullName,
        bio,
        gender,
        avatar: newAvatar,
      };
      const updateResponse: any = await updateProfileAPI(newProfile);
      const { status, message } = updateResponse || {};
      if (status === 200) {
        notiSuccess(t('info_change_success'));
        const newInfo = {
          ...currentUser,
          avatar: newAvatar,
          fullName: fullName,
          bio: bio,
          gender: gender,
        };
        dispatch(setCurrentUser(newInfo));
        navigate(`${PATH.PROFILE.replace(':userCode', currentUser.userCode)}`);
      } else {
        notiError(t('smt_wrong'));
      }
    }
  };

  return (
    <div className='pt-10 px-6 flex gap-3 justify-center'>
      <div className='w-1/5'>
        <p
          className={`text-2xl mb-5 cursor-pointer ${
            pick !== 'edit' && 'text-gray-text-w'
          }`}
          onClick={() => handlePick('edit')}
        >
          {t('edit_pf')}
        </p>
        <p
          className={`text-2xl mb-5 cursor-pointer ${
            pick !== 'pass' && 'text-gray-text-w'
          }`}
          onClick={() => handlePick('pass')}
        >
          {t('change_pass')}
        </p>
      </div>
      <div className='w-3/4'>
        <div className='flex gap-6 items-start'>
          <div className='flex-1 flex justify-end '>
            {imgUrl ? (
              <img
                src={imgUrl}
                alt='Selected Thumbnail'
                className='w-[38px] h-[38px] overflow-hidden object-cover rounded-full'
              />
            ) : (
              <img
                src={avatarView}
                alt=''
                className='w-[38px] h-[38px] overflow-hidden object-cover rounded-full'
              />
            )}
          </div>
          <div className='flex-3 flex flex-col justify-start items-start mx-1'>
            <p className='m-1'>{currentUser?.userName}</p>
            <ChangeAvatar
              setSelectedImg={setSelectedImg}
              setImgUrl={setImgUrl}
              setIsChange={setIsChange}
            />
          </div>
        </div>
        <div className='flex gap-6'>
          <p className='flex-1 flex justify-end font-semibold'>
            {t('fullName_pf')}
          </p>
          <div className='flex flex-3 flex-col'>
            <input
              value={fullName}
              maxLength={150}
              onChange={handleChangeName}
              className='px-2 py-1 m-1 outline-none resize-none border rounded-md dark:bg-black'
            />
            <p className='text-xs text-gray-text-w m-1 '>{bioCount}/150</p>
          </div>
        </div>
        <div className='flex gap-6'>
          <p className='flex-1 flex justify-end font-semibold'>{t('bio_pf')}</p>
          <div className='flex flex-3 flex-col'>
            <textarea
              value={bio}
              maxLength={150}
              onChange={handleChangeBio}
              className='px-2 py-1 m-1 outline-none resize-none border rounded-md h-[100px] dark:bg-black'
            />
            <p className='text-xs text-gray-text-w m-1 '>{bioCount}/150</p>
          </div>
        </div>
        <div className='flex gap-6'>
          <p className='flex-1 flex justify-end font-semibold'>
            {t('gender_pf')}
          </p>
          <div className='flex-3'>
            <p
              className='border rounded-md px-2 py-1 m-1 cursor-pointer'
              onClick={showModalGender}
            >
              {gender === 0
                ? t('male')
                : gender === 1
                ? t('female')
                : gender === 2 && t('gender_not_say_pf')}
            </p>
            <p className='rounded-md py-1 m-1 text-gray-text-w text-sm'>
              {t('gender_pf_intro')}
            </p>
            <p
              className={`rounded-md px-2 py-1 mx-1 my-3 cursor-pointer w-fit text-white ${
                isChange ? 'bg-blue-chat' : 'bg-gray-text-w'
              }`}
              onClick={handleSubmit}
            >
              {t('update')}
            </p>
          </div>
        </div>
      </div>
      {openModalChangeGender && (
        <ChangeGender
          openModalChangeGender={openModalChangeGender}
          handleCancel={handleCancelGender}
          onChangeGender={onChangeGender}
          gender={gender}
        />
      )}
      {openModalChangePass && (
        <ChangePassword
          openModalChangePass={openModalChangePass}
          handleCancel={handleCancelPassword}
        />
      )}
    </div>
  );
};

export default EditProfile;
