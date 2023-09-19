// Trong Interact.tsx
import React, { useEffect, useState } from 'react';
import { AiFillHeart, AiOutlineHeart } from 'react-icons/ai';
import { MdBookmarkBorder } from 'react-icons/md';
import ModalPost from '../../../../layouts/ModalPost';
import { addCommentAPI, getCommentLengthAPI } from '../../../../services/post';
import { useTranslation } from 'react-i18next';
import { useSelector } from 'react-redux';
import { getCurrentUser } from '../../../../stores/slices/userSlice';
import {
  deleteReactAPI,
  profileReactAPI,
  reactAPI,
} from '../../../../services/profile';
import { createNotiAPI, deleteNotiAPI } from '../../../../services/user';
import { NavLink } from 'react-router-dom';
import { FaRegComment } from 'react-icons/fa';
import { FiSend } from 'react-icons/fi';

const Interact = ({ interact }: any) => {
  const [isModalVisible, setIsModalVisible] = React.useState(false);
  const cmt = true;
  const [commentLength, setCommentLength] = useState<any>('');
  const [isLike, setIsLike] = useState(false);
  const [react, setReact] = useState<any>('');
  const [comment, setComment] = useState('');
  const [showFullContent, setShowFullContent] = useState(false);

  const { t } = useTranslation(['home']);
  const user = useSelector(getCurrentUser);
  const openModal = () => {
    setIsModalVisible(true);
  };
  // Lấy chiều dài comment về
  const getCommentLength = async () => {
    const response = await getCommentLengthAPI(interact?.postCode);
    setCommentLength(response);
  };

  // Xem đã thả tim hay chưa
  const getReactPost = async () => {
    const getReact: any = await profileReactAPI(interact?.postCode);
    setReact(getReact);
    if (
      getReact?.allReactPost?.find(
        (reacts: any) => reacts?.user?.userCode === user?.userCode
      )
    ) {
      setIsLike(true);
    } else {
      setIsLike(false);
    }
  };

  // Thả tim
  const handleReactPost = async (post_id: number) => {
    const newReact = {
      post_id: post_id,
      user_id: user?.id,
    };
    const newNoti = {
      interact_id: user?.id,
      type: 'like',
      post_id: post_id,
      user_id: null,
    };
    if (!isLike) {
      if (interact?.user.id !== user?.id) {
        await createNotiAPI(newNoti);
      }
      const response = await reactAPI(newReact);
      if (response?.status === 201) setIsLike(true);
      getReactPost();
    } else {
      if (interact?.user.id !== user?.id) {
        await deleteNotiAPI(newNoti);
      }
      const response = await deleteReactAPI(post_id, user?.id);
      if (response?.status === 200) setIsLike(false);
      getReactPost();
    }
  };

  // Đăng bình luận
  const handleButtonPost = async (
    post_id: number,
    cmt_reply: number,
    comment: string
  ) => {
    let level = 1;
    if (cmt_reply > 0) {
      level = 2;
    }
    const newPost = {
      post_id: post_id,
      user_id: user?.id,
      content: comment,
      level,
      cmt_reply,
    };
    if (comment != '') {
      await addCommentAPI(newPost);
      setComment('');
      getCommentLength();
    }
    // Gửi thông báo
    if (interact?.user.id !== user?.id) {
      const newNoti = {
        interact_id: user?.id,
        type: 'comment',
        post_id: post_id,
        user_id: null,
      };
      await createNotiAPI(newNoti);
    }
    setComment('');
    getCommentLength();
  };

  useEffect(() => {
    getCommentLength();
    getReactPost();
  }, [user, isModalVisible]);

  return (
    <div className='pb-4 border-b border-gray-1 max-w-[500px]'>
      <div>
        <div className='flex justify-between mt-2 items-center'>
          <div className='flex gap-4 items-center'>
            {isLike ? (
              <p
                className='cursor-pointer text-red'
                onClick={() => handleReactPost(interact?.id)}
              >
                <AiFillHeart size={30} />
              </p>
            ) : (
              <p
                className='cursor-pointer '
                onClick={() => handleReactPost(interact?.id)}
              >
                <AiOutlineHeart size={30} />
              </p>
            )}
            <p className='cursor-pointer' onClick={openModal}>
              {' '}
              <FaRegComment size={26} />
            </p>
            <p className='cursor-pointer'>
              {' '}
              <FiSend size={26} />
            </p>
          </div>
          <p className='cursor-pointer '>
            <MdBookmarkBorder size={30} />
          </p>
        </div>
        {react?.allReactPost?.length > 0 ? (
          <p className='font-semibold text-[rgb(38,38,38)] mt-3 dark:text-white'>
            {react?.allReactPost?.length} {t('likes_tl')}
          </p>
        ) : (
          ''
        )}

        <div className=' mt-2'>
          <p>
            <NavLink to={`/profile/${interact?.user?.userCode}`}>
              <span className='font-semibold text-[rgb(38,38,38)] cursor-pointer pr-4 dark:text-white'>
                {interact?.user?.userName}
              </span>
            </NavLink>
            <span className='break-words'>
              {interact?.content.length > 150
                ? `${interact?.content.slice(0, 100)}...`
                : interact?.content}
            </span>
          </p>
        </div>
        {commentLength?.cmtQuantity > 0 ? (
          <p
            className='mt-2 cursor-pointer font-normal text-[rgd(115,115,115)]'
            onClick={openModal}
          >
            {t('view_tl')} <span>{commentLength?.cmtQuantity}</span>{' '}
            {t('comment_tl')}
          </p>
        ) : (
          ''
        )}

        <div className='flex justify-between mt-2'>
          <input
            type='text'
            value={comment}
            placeholder={t('add_cmt_tl')}
            className='outline-none w-[400px] dark:bg-black'
            onChange={(e) => setComment(e.target.value)}
          />
          {comment === '' ? (
            <div className='font-semibold text-[rgb(201,224,239)] mr-2'>
              {t('post_tl')}
            </div>
          ) : (
            <button
              className='font-semibold text-[rgb(0,149,246)] mr-2'
              onClick={() => handleButtonPost(interact?.id, -1, comment)}
            >
              {t('post_tl')}
            </button>
          )}
        </div>
      </div>
      <ModalPost
        isVisible={isModalVisible}
        closeModal={() => setIsModalVisible(false)}
        interact={interact}
        commentLength={commentLength}
        cmt={cmt}
      />
    </div>
  );
};

export default Interact;
