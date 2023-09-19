import { BsBookmark } from 'react-icons/bs';
import {
  MdOutlinePermContactCalendar,
  MdOutlineViewCompact,
} from 'react-icons/md';
import { useEffect, useState } from 'react';
import { AiFillHeart } from 'react-icons/ai';
import { FaComment } from 'react-icons/fa';
import { useParams } from 'react-router';
import { profileImageAPI } from '../../../services/profile';
import ReactPlayer from 'react-player';
import ModalPost from '../../../layouts/ModalPost';
import { useTranslation } from 'react-i18next';
import { setCreatePost } from '../../../stores/slices/appSlice';
import { useDispatch, useSelector } from 'react-redux';
import { FiCamera } from 'react-icons/fi';
import { getPostHome, setPostHome } from '../../../stores/slices/postSlice';
import { getCurrentUser } from '../../../stores/slices/userSlice';

const MainProfile = () => {
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [selectedMedia, setSelectedMedia] = useState(null);
  const cmt = true;
  const params = useParams();
  const { t } = useTranslation(['profile']);
  const dispatch = useDispatch();

  const profile = useSelector(getPostHome);
  const user = useSelector(getCurrentUser);

  const openModal = async (selectedMedia: any) => {
    setSelectedMedia(selectedMedia);
    setIsModalVisible(true);
  };

  const getProfilePhoto = async (userCode: string) => {
    const response: any = await profileImageAPI(userCode);
    let newPost = [];
    if (Array.isArray(response.post)) {
      newPost = response.post.reverse();
      dispatch(setPostHome(newPost));
    }
  };

  useEffect(() => {
    const { userCode } = params || {};
    if (userCode) {
      getProfilePhoto(userCode);
    }
  }, [params, isModalVisible]);

  const handleCreate = () => {
    dispatch(setCreatePost(true));
  };

  return (
    <div className='w-full mt-10'>
      <div>
        <div className='flex justify-center pt-3 border-t gap-12 text-[rgb(115,115,115)] text-sm'>
          <div className='cursor-pointer flex items-center gap-1'>
            <MdOutlineViewCompact /> <p>{t('posts_pf')}</p>
          </div>
          <div className='cursor-pointer flex items-center gap-1'>
            <BsBookmark />
            <p>{t('saved_pf')}</p>
          </div>
          <div className='cursor-pointer flex items-center gap-1'>
            <MdOutlinePermContactCalendar />
            <p>{t('tagged_pf')}</p>
          </div>
        </div>
        {profile?.length > 0 ? (
          <div className='mt-[40px] flex flex-wrap gap-1 gallery justify-start mx-28'>
            {profile?.map((medias: any) => {
              return (
                <div
                  className='gallery-item bg-gray-text-b mt-1'
                  key={medias.id}
                  onClick={() => openModal(medias)}
                >
                  {medias?.media[0]?.type === 'image' && (
                    <div className='gallery-image'>
                      <img
                        src={medias?.media[0]?.mediaUrl}
                        alt=''
                        width={300}
                        className='overflow-hidden object-cover h-[300px] z-10'
                      />
                    </div>
                  )}

                  {medias?.media[0]?.type === 'video' && (
                    <div className='w-[100%]'>
                      <div className='gallery-image w-[300px]'>
                        <ReactPlayer
                          url={medias?.media[0]?.mediaUrl}
                          width={'100%'}
                          height={'100%'}
                        />
                      </div>
                    </div>
                  )}
                  <div className='gallery-item-info'>
                    <ul className='flex items-center'>
                      <div className='flex items-center gap-3'>
                        <AiFillHeart size={28} />
                        <li className='gallery-item-likes'>
                          <span className='visually-hidden'>
                            {medias?.reactPost?.length}
                          </span>
                        </li>
                      </div>
                      <div className='flex items-center gap-3'>
                        <FaComment size={25} />
                        <li className='gallery-item-comments'>
                          <span className='visually-hidden'>
                            {medias?.comment?.length}
                          </span>
                        </li>
                      </div>
                    </ul>
                  </div>
                </div>
              );
            })}
          </div>
        ) : user?.userCode === params?.userCode ? (
          <div className='h-[300px] w-full flex flex-col gap-5 justify-center items-center font-semibold text-[30px]'>
            <p
              className='border rounded-full p-6 cursor-pointer'
              onClick={handleCreate}
            >
              <FiCamera size={50} />
            </p>
            <p>{t('posts_yet')}</p>
          </div>
        ) : (
          <div className='h-[300px] w-full flex flex-col gap-5 justify-center items-center font-semibold text-[30px]'>
            <p>{t('posts_yet')}</p>
          </div>
        )}
      </div>
      {/* {isModalVisible && ( */}
      <ModalPost
        closeModal={() => setIsModalVisible(false)}
        isVisible={isModalVisible}
        interact={selectedMedia}
        cmt={cmt}
      />
      {/* )} */}
    </div>
  );
};

export default MainProfile;
