import React, { useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { PATH } from '../../../services/list-path';
import { useTranslation } from 'react-i18next';
import { MiniUserType } from '../../../constants/type';
import Modal from 'antd/es/modal/Modal';
import { deleteMessAPI } from '../../../services/message';
import { useSelector } from 'react-redux';
import { getCurrentUser } from '../../../stores/slices/userSlice';
import { notiError } from '../../../constants/notification';
import '../Mess.css';

interface MessDetailProp {
  memberWithoutMe: MiniUserType[];
  setDeletedChat: React.Dispatch<React.SetStateAction<boolean>>;
  setDeleteGroup: React.Dispatch<React.SetStateAction<string>>;
  deleteGroup: string;
}
const MessDetail = ({
  memberWithoutMe,
  setDeletedChat,
  setDeleteGroup,
  deleteGroup,
}: MessDetailProp) => {
  const { t } = useTranslation(['message']);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const pathname = useParams();
  const groupCode = pathname.chatCode || '';
  const currentUser = useSelector(getCurrentUser);

  const showModal = () => {
    setIsModalOpen(true);
  };

  const handleDelete = async () => {
    const response = await deleteMessAPI(groupCode, currentUser?.id);
    if (response.status === 200) {
      setDeletedChat((pre) => !pre);
      let newDeleteGroup='';
      if (deleteGroup === 'null') {
        newDeleteGroup = `${groupCode}`;
      } else if (!deleteGroup.split(', ').includes(`${groupCode}`)) {
        newDeleteGroup = `${deleteGroup}, ${groupCode}`;
      }
      setDeleteGroup(newDeleteGroup);
    } else {
      notiError(`${t('err')}`);
    }
    setIsModalOpen(false);
  };

  const handleCancel = () => {
    setIsModalOpen(false);
  };
  return (
    <div
      className='flex-1 border-l border-gray-1 dark:border-gray-setting flex flex-col min-w-[200px]
     justify-between'
    >
      <div className='border-b border-gray-1 dark:border-gray-setting px-3 py-4 h-[77px]'>
        <span className='text-lg font-bold h-[44px] flex items-center'>
          {t('detail')}
        </span>
      </div>
      <div className='p-3 flex flex-col gap-2 items-start h-full border-b border-gray-1 dark:border-gray-setting '>
        <span className='font-semibold mb-1'>{t('member')}</span>
        <div className='flex gap-5 flex-col'>
          {memberWithoutMe.map((member) => (
            <Link to={`${PATH.PROFILE.replace(':userCode', member?.userCode)}`}>
              <div className='flex items-center gap-2' key={member?.id}>
                <img
                  src={member?.avatar}
                  alt=''
                  className='w-14 h-14 overflow-hidden object-cover rounded-full'
                />
                <div className='flex flex-col'>
                  <span>{member?.userName}</span>
                  <span className='text-xs text-gray-text-w'>
                    {member?.fullName}
                  </span>
                </div>
              </div>
            </Link>
          ))}
          {memberWithoutMe.length > 1 && (
            <div className='flex items-center gap-2'>
              <img
                src={currentUser?.avatar}
                alt=''
                className='w-14 h-14 overflow-hidden object-cover rounded-full'
              />
              <div className='flex flex-col'>
                <span>{currentUser?.userName}</span>
                <span className='text-xs text-gray-text-w'>
                  {currentUser?.fullName}
                </span>
              </div>
            </div>
          )}
        </div>
      </div>
      <div className='h-fit flex p-3 mb-3'>
        <span className='text-red cursor-pointer text-lg' onClick={showModal}>
          {t('del_chat')}
        </span>
      </div>
      <Modal
        title={t('is_del_chat')}
        open={isModalOpen}
        footer={null}
        style={{ fontSize: '20px', textAlign: 'center' }}
      >
        <div
          className='border-y border-gray-1 py-3 text-center text-base font-semibold text-red cursor-pointer'
          onClick={handleDelete}
        >
          {t('del')}
        </div>
        <div
          className='py-3 text-center text-base font-semibold text-gray-text-w cursor-pointer'
          onClick={handleCancel}
        >
          {t('cancel')}
        </div>
      </Modal>
    </div>
  );
};

export default MessDetail;
