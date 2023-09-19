import { Modal } from 'antd';
import 'slick-carousel/slick/slick.css';
import 'slick-carousel/slick/slick-theme.css';
import { AiFillHeart, AiOutlineHeart } from 'react-icons/ai';
import {
  addCommentAPI,
  getCommentAPI,
  getReactionAPI,
} from '../../services/post';
import { useEffect, useState } from 'react';
import { BiComment } from 'react-icons/bi';
import { BsSend } from 'react-icons/bs';
import { MdBookmarkBorder } from 'react-icons/md';
import moment from 'moment';
import { useTranslation } from 'react-i18next';
import { useSelector } from 'react-redux';
import { getCurrentUser } from '../../stores/slices/userSlice';
import { commentProfile } from '../../constants/type';
import Slice from './components/Slice';
import Cmt from './components/Cmt';
import { createNotiAPI, deleteNotiAPI } from '../../services/user';
import { deleteReactAPI, reactAPI } from '../../services/profile';
import HeaderModal from './components/HeaderModal';

const ModalPostManage = ({
  isVisible,
  closeModal,
  interact,
  commentLength,
  handleHidePost,
}: any) => {
  const [comment, setComment] = useState<commentProfile>();
  const { t } = useTranslation(['home']);
  const [react, setReact] = useState<any>('');
  const [isLike, setIsLike] = useState(false);
  const [likeCount, setLikeCount] = useState(0);
  const [commentUser, setCommentUser] = useState('');
  const user = useSelector(getCurrentUser);

  // Đóng mở modal
  const handleOk = () => {
    closeModal();
  };

  const handleCancel = () => {
    closeModal();
  };

  // Lấy comment về
  const getComment = async () => {
    const cmtRes: any = await getCommentAPI(interact?.postCode);
    const reactionRes: any = await getReactionAPI(interact?.postCode);
    setComment(cmtRes);
    setReact(reactionRes);
    setLikeCount(reactionRes?.allReactPost?.length || 0);
    if (
      reactionRes?.allReactPost?.find(
        (reacts: any) => reacts?.user?.userCode === user?.userCode
      )
    ) {
      setIsLike(true);
    } else {
      setIsLike(false);
    }
  };

  useEffect(() => {
    getComment();
    setLikeCount(0);
  }, [commentLength, interact]);
  // Like bài viết
  const handleReactPost = async () => {
    const newReact = {
      post_id: interact?.id,
      user_id: user?.id,
    };
    const newNoti = {
      interact_id: user?.id,
      type: 'like',
      post_id: interact?.id,
      user_id: null,
    };
    if (!isLike) {
      if (interact?.user?.id !== user?.id) {
        await createNotiAPI(newNoti);
      }
      const response = await reactAPI(newReact);
      if (response?.status === 201) {
        setIsLike(true);
        setLikeCount((pre) => pre + 1);
      }
    } else {
      if (interact?.user.id !== user?.id) {
        await deleteNotiAPI(newNoti);
      }
      const response = await deleteReactAPI(interact?.id, user?.id);
      if (response?.status === 200) {
        setIsLike(false);
        setLikeCount((pre) => pre - 1);
      }
    }
  };

  const handleButtonPost = async (
    post_id: number,
    cmt_reply: number,
    commentUser: string
  ) => {
    let level = 1;
    if (cmt_reply > 0) {
      level = 2;
    }
    const newPost = {
      post_id: post_id,
      user_id: user?.id,
      content: commentUser,
      level,
      cmt_reply,
    };
    await addCommentAPI(newPost);
    // setCommentUser('');
    getComment();
    if (interact?.user.id !== user?.id) {
      const newNoti = {
        interact_id: user?.id,
        type: 'comment',
        post_id: post_id,
        user_id: null,
      };
      await createNotiAPI(newNoti);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.keyCode === 13) {
      handleButtonPost(interact?.id, -1, commentUser);
    }
  };
  
  return (
    <div>
      <div>
        <Modal
          open={isVisible}
          centered
          onOk={handleOk}
          onCancel={handleCancel}
          footer={null}
          width={1000}
          bodyStyle={{ maxHeight: '625px' }}
        >
          <div className='flex justify-between gap-3'>
            <div className='w-[50%] md:h-[100%] border-r bg-black'>
              <Slice interact={interact} />
            </div>

            <div className='w-full md:w-[48%]'>
              <div className='flex flex-col justify-between h-[500px]'>
                <div>
                  <div>
                    <HeaderModal
                      post={interact}
                      closeModal={closeModal}
                      handleHidePost={handleHidePost}
                    />
                  </div>
                  <div className='max-h-[220px] overflow-y-auto mt-6'>
                    <div className='flex gap-2 w-full items-start justify-start'>
                      <div className='w-14 overflow-hidden origin-center rounded-full'>
                        <img
                          src={interact?.user?.avatar}
                          className='h-12 w-12 overflow-hidden origin-center rounded-full'
                        />
                      </div>
                      <div className='flex mr-3 w-fit justify-start items-start gap-2'>
                        <b>{interact?.user?.userName}</b>{' '}
                        <span className=''>{interact?.content}</span>
                      </div>
                    </div>
                    {comment &&
                      comment?.allCmt.map((cmt: any) => (
                        <Cmt cmt={cmt} key={cmt?.id} />
                      ))}
                  </div>
                </div>
                <div className=' inset-x-0 bg-white border-t mt-2 pt-2 mb-2 mr-2'>
                  <div className='flex justify-between items-center'>
                    <div className='flex gap-2 items-center'>
                      {isLike ? (
                        <p
                          className='cursor-pointer text-red'
                          onClick={handleReactPost}
                        >
                          <AiFillHeart size={30} />
                        </p>
                      ) : (
                        <p
                          className='cursor-pointer '
                          onClick={handleReactPost}
                        >
                          <AiOutlineHeart size={30} />
                        </p>
                      )}
                      <p className='cursor-pointer '>
                        {' '}
                        <BiComment size={28} />
                      </p>
                      <p className='cursor-pointer '>
                        {' '}
                        <BsSend size={26} />
                      </p>
                    </div>

                    <p className='cursor-pointer mr-2'>
                      <MdBookmarkBorder size={30} />
                    </p>
                  </div>
                  <div>
                    <p className='font-semibold text-[rgb(38,38,38)] mt-3 '>
                      {likeCount || 0} {t('likes_tl')}
                    </p>
                    <p className='mt-2'>
                      {' '}
                      {moment(interact?.post_time).format('YYYY-MM-DD')}
                    </p>
                    <div className='flex justify-between mt-2 border-t pt-4 pb-2 mr-1'>
                      <input
                        type='text'
                        placeholder={t('add_cmt_tl')}
                        value={commentUser}
                        className='outline-none w-[400px]'
                        onChange={(e) => setCommentUser(e.target.value)}
                        onKeyDown={handleKeyDown}
                      />
                      <button
                        className='font-semibold text-[rgb(0,149,246)] mr-2'
                        onClick={() =>
                          handleButtonPost(interact?.id, -1, commentUser)
                        }
                      >
                        {t('post_tl')}
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </Modal>
      </div>
    </div>
  );
};

export default ModalPostManage;
