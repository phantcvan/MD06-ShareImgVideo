import { AiOutlineDown } from 'react-icons/ai';
import { FiMapPin } from 'react-icons/fi';
import { useDispatch, useSelector } from 'react-redux';
import { getCurrentUser } from '../../stores/slices/userSlice';
import { Avatar } from 'antd';
import axios from 'axios';
import 'slick-carousel/slick/slick.css';
import 'slick-carousel/slick/slick-theme.css';
import ReactPlayer from 'react-player';
import { useState } from 'react';
import {
  createMediaAPI,
  createPostAPI,
  editPostAPI,
  postOneAPI,
} from '../../services/post';
import { getPost, setCreatePost } from '../../stores/slices/appSlice';
import { useTranslation } from 'react-i18next';
import { NavLink } from 'react-router-dom';
import { notiError, notiSuccess } from '../../constants/notification';
import {
  getPostHome,
  getPostView,
  setPostHome,
  setPostView,
  setStep,
} from '../../stores/slices/postSlice';

const AddTitle = ({ fileMedia, imgUrl }: any) => {
  const posts = useSelector(getPostHome);
  const post = useSelector(getPost);
  const [content, setContent] = useState(post?.content || '');
  const user = useSelector(getCurrentUser);
  const { t } = useTranslation(['post']);
  const dispatch = useDispatch();
  const postView = useSelector(getPostView);
  // Thêm vào bảng post
  const handlePost = async () => {
    const user_id = user?.id;
    if (content === '') {
      notiError(`${t('Content cannot be empty')}`);
      return;
    }
    const newContent = {
      content,
      user_id,
    };
    const response: any = await createPostAPI(newContent);

    if (response?.status === 201) {
      notiSuccess(`${t('success_p')}`);
      dispatch(setCreatePost(false));
      dispatch(setStep(1));
    }

    // Đưa lên cloudinary
    const formDataDetails = new FormData();
    const imageUrls: string[] = [];

    for (let i = 0; i < fileMedia.length; i++) {
      const file = fileMedia[i];
      const fileExtension = file.name.split('.').pop().toLowerCase();
      const cloudinaryEndpoint =
        fileExtension === 'mp4'
          ? 'https://api.cloudinary.com/v1_1/dbs47qbrd/video/upload'
          : 'https://api.cloudinary.com/v1_1/dbs47qbrd/image/upload';
      formDataDetails.delete('file');
      formDataDetails.append('file', file);
      formDataDetails.append('upload_preset', 'instagram');

      const imageUploadResponse = await axios.post(
        cloudinaryEndpoint,
        formDataDetails
      );
      const imageUrl = imageUploadResponse.data.secure_url;
      imageUrls.push(imageUrl);
    }

    //Thêm vào bảng media
    imageUrls.map(async (imageUrl) => {
      let mediaType = 'image';

      // Kiểm tra phần mở rộng của URL để xác định loại
      const urlParts = imageUrl.split('.');
      const fileExtension = urlParts[urlParts.length - 1];

      if (
        fileExtension === 'jpg' ||
        fileExtension === 'jpeg' ||
        fileExtension === 'png'
      ) {
        mediaType = 'image';
      } else if (fileExtension === 'mp4') {
        mediaType = 'video';
      }

      const newMedia = {
        post_id: response?.post_id,
        mediaUrl: imageUrl,
        type: mediaType,
      };
      const media = await createMediaAPI(newMedia);

      // Thêm bài viết mới vào redux
      if (media?.status === 201) {
        const newPost: any = await postOneAPI(response?.post_id);
        dispatch(setPostHome([newPost?.post, ...posts]));
      }
    });
  };

  // Chỉnh sửa bài viết
  const handleEditPost = async () => {
    const newEdit = {
      id: post.id,
      content,
    };
    await editPostAPI(newEdit);
    const editedPosts = posts.map((post: any) => {
      if (post.id === newEdit.id) {
        return { ...post, content: newEdit.content };
      }
      return post;
    });
    dispatch(setPostHome(editedPosts));
    dispatch(setCreatePost(false));
    dispatch(setStep(1));
    // sửa trong postView
    const updatedPosts = postView.map((pv: any) => {
      if (pv.id === post.id) {
        return { ...pv, content: content };
      }
      return pv;
    });
    dispatch(setPostView(updatedPosts));
  };

  // Quay lại
  const handleBack = () => {
    dispatch(setStep(1));
  };

  return (
    <div>
      <div className='bg-white fixed top-[10%] min-h-[471px] h-[480px] min-w-[900px] w-2/3 left-[20%] rounded-lg z-50 dark:bg-black'>
        {post ? (
          <div className='flex justify-between px-5 py-2 border-b border-gray-1 '>
            <p className='cursor-pointer'>{t('cancel_p')}</p>
            <p>{t('edit_p')}</p>
            <p
              className='cursor-pointer font-semibold text-[rgb(0,149,246)]'
              onClick={handleEditPost}
            >
              {t('done_p')}
            </p>
          </div>
        ) : (
          <div className='flex justify-between px-5 py-2 border-b border-gray-1'>
            <p className='cursor-pointer' onClick={handleBack}>
              {t('back_p')}
            </p>
            <p>{t('create_p')}</p>
            <p
              className='cursor-pointer font-semibold text-[rgb(0,149,246)]'
              onClick={handlePost}
            >
              {t('share_p')}
            </p>
          </div>
        )}

        <div className='flex h-[100%]'>
          <div className=' w-1/2 border-r border-gray-1 flex items-center justify-center bg-white dark:bg-black'>
            {imgUrl?.includes('data:video/mp4;base64,') ||
            post?.media[0].type === 'video' ? (
              <div className='edit-video h-[475px] w-[480px]'>
                <ReactPlayer
                  url={imgUrl || post?.media[0].mediaUrl}
                  playing={true}
                  width={'100%'}
                  height={'100%'}
                />
              </div>
            ) : (
              <div className='w-full h-[480px]'>
                <img
                  src={imgUrl || post?.media[0].mediaUrl}
                  alt=''
                  width={'100%'}
                  className='overflow-hidden object-cover h-[100%]'
                />
              </div>
            )}
          </div>

          <div className='bg-white w-1/2 pl-5 mt-4 dark:bg-black'>
            <div className='flex gap-5 items-center'>
              <NavLink to={`/profile/${user?.userCode}`}>
                <Avatar src={user?.avatar} size={50}>
                  ĐN
                </Avatar>
              </NavLink>
              <NavLink to={`/profile/${user?.userCode}`}>
                <p className='font-semibold'>{user?.userName}</p>
              </NavLink>
            </div>
            <div className='mt-6'>
              <textarea
                name=''
                id=''
                cols={50}
                rows={8}
                className='outline-none resize-none dark:bg-black'
                placeholder={t('write_p')}
                value={content}
                onChange={(e) => setContent(e.target.value)}
              ></textarea>
            </div>
            <div className='flex flex-col gap-3 pr-4 mt-5'>
              <div className='flex justify-between items-center border-t border-gray-1'>
                <p> {t('location_p')}</p>
                <FiMapPin className='pr-4' size={35} />
              </div>
              <div className='flex justify-between items-center border-t border-gray-1'>
                <p>{t('access_p')}</p>
                <AiOutlineDown className='pr-4' size={35} />
              </div>
              <div className='flex justify-between items-center border-t border-gray-1'>
                <p>{t('setting_p')}</p>
                <AiOutlineDown className='pr-4' size={35} />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AddTitle;
