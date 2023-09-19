import { Avatar, Dropdown, Modal } from 'antd';
import Slider from 'react-slick';
import 'slick-carousel/slick/slick.css';
import 'slick-carousel/slick/slick-theme.css';
import ReactPlayer from 'react-player';
import '../views/home/components/css/Posts.css';
import { AiFillHeart, AiOutlineHeart } from 'react-icons/ai';
import {
  addCommentAPI,
  deletePostAPI,
  getCommentAPI,
  getReactionAPI,
} from '../services/post';
import { useEffect, useState } from 'react';
import { BsThreeDots } from 'react-icons/bs';
import { MdBookmarkBorder } from 'react-icons/md';
import moment from 'moment';
import { useTranslation } from 'react-i18next';
import { useDispatch, useSelector } from 'react-redux';
import { getCurrentUser } from '../stores/slices/userSlice';
import { PostManageType, commentProfile } from '../constants/type';
import { notiSuccess } from '../constants/notification';
import { setCreatePost, setPost } from '../stores/slices/appSlice';
import { updateStatusPostAPI } from '../services/admin';
import {
  getPostHome,
  getPostView,
  setPostHome,
  setPostView,
  setStep,
} from '../stores/slices/postSlice';
import { createNotiAPI, deleteNotiAPI } from '../services/user';
import { NavLink } from 'react-router-dom';
import ReactComment from './createPost/ReactComment';
import { FiSend } from 'react-icons/fi';
import { FaRegComment } from 'react-icons/fa';
import { deleteReactAPI, profileReactAPI, reactAPI } from '../services/profile';

const settings = {
  slidesToShow: 1,
  slidesToScroll: 1,
  autoplay: false,
  infinite: false,
};
const ModalPost = ({ isVisible, closeModal, interact, commentLength }: any) => {
  const [comments, setComments] = useState<commentProfile[]>([]);
  const [commentUser, setCommentUser] = useState('');
  const { t } = useTranslation(['home']);
  const [close, setClose] = useState(false);
  const [playing, setPlaying] = useState(true);
  const [reaction, setReaction] = useState<any>('');
  const [react, setReact] = useState<any>('');
  const [isLike, setIsLike] = useState(false);

  const postView = useSelector(getPostView);
  const posts = useSelector(getPostHome);
  const user = useSelector(getCurrentUser);
  const dispatch = useDispatch();

  // Đóng mở modal
  const handleOk = () => {
    closeModal();
  };

  const handleCancel = () => {
    setPlaying(false);
    setClose(true);
    closeModal();
  };

  useEffect(() => {
    setCommentUser('');
    closeModal();
  }, [close]);

  // Xem đã thả tim hay chưa
  const getReactPost = async () => {
    const getReact: any = await profileReactAPI(interact?.postCode);
    setReaction(getReact);
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

  useEffect(() => {
    getReactPost();
  }, [interact, isVisible]);

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

  // Lấy comment về
  const getComment = async () => {
    const cmtRes: any = await getCommentAPI(interact?.postCode);
    const reactionRes: any = await getReactionAPI(interact?.postCode);
    cmtRes.allCmt.reverse();
    setComments(cmtRes.allCmt);
    setReact(reactionRes);
  };

  // Xóa bài viết
  const handleDeletePost = async (postCode: string) => {
    const removePosts = await deletePostAPI(postCode);
    const { status } = removePosts || {};
    if (status === 200) notiSuccess(`${t('NotiS_p')}!`);
    const updatedPosts = posts.filter(
      (post: any) => post.postCode !== postCode
    );
    dispatch(setPostHome(updatedPosts));
    closeModal();
  };

  // Chỉnh sửa bài viết
  const handleEdit = async () => {
    closeModal();
    dispatch(setCreatePost(true));
    dispatch(setPost(interact));
    dispatch(setStep(2));
  };

  // Bình luận
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
    setCommentUser('');
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

  useEffect(() => {
    getComment();
  }, [commentLength, interact]);

  const handleHidePost = async (code: string) => {
    if (user?.status >= 2) {
      const response = await updateStatusPostAPI(code);
      const { status } = response || {};
      if (status === 200) {
        // Lưu dữ liệu vào timeLine ở redux: xoá bài viết ở timeline
        // hiển thị "Ẩn bài viết ở trang quản trị"
        let updatedData: PostManageType[] = [];
        updatedData = postView?.map((post: PostManageType) => {
          if (post.postCode === code) {
            if (post.status === 0) return { ...post, status: 1 };
            if (post.status === 1) return { ...post, status: 0 };
          }
          return post;
        });
        dispatch(setPostView(updatedData));
      }
    }
  };
  const menuItems = [];
  if (interact?.user?.userCode === user?.userCode) {
    menuItems.push(
      {
        key: '1',
        label: <p onClick={handleEdit}>Chỉnh Sửa</p>,
      },
      {
        key: '2',
        label: (
          <p onClick={() => handleDeletePost(interact?.postCode)}>
            Xóa Bài Viết
          </p>
        ),
      }
    );
  }
  if (user?.status >= 2) {
    menuItems.push({
      key: '3',
      label: (
        <p onClick={() => handleHidePost(interact?.postCode)}>Ẩn Bài Viết</p>
      ),
    });
  }

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
          <div className='flex justify-between dark:bg-black dark:text-white'>
            <div className='w-[50%] bg-white border-r border-gray-1 rounded-lg'>
              {/* <div className='h-[500px] w-[100%] flex items-center'> */}
              <Slider {...settings}>
                {interact?.media?.map((media: any) =>
                  media.type === 'image' ? (
                    <img
                      src={media.mediaUrl}
                      alt=''
                      key={media.id}
                      width={'100%'}
                      height={625}
                      className='md:h-[500px] object-cover overflow-hidden rounded-lg'
                    />
                  ) : media.type === 'video' ? (
                    <div className='container-video' key={media.id}>
                      <ReactPlayer
                        url={media?.mediaUrl}
                        playing={playing}
                        controls={false}
                        width={'100%'}
                        height={'100%'}
                      />
                    </div>
                  ) : null
                )}
              </Slider>
              {/* </div> */}
            </div>

            <div className='w-full md:w-[48%]'>
              <div className='flex flex-col justify-between h-[500px]'>
                <div>
                  <div className='flex items-center justify-between border-b border-gray-1 pb-2 mr-3'>
                    <div className='flex items-center gap-2 my-3 '>
                      <div>
                        <NavLink to={`/profile/${interact?.user?.userCode}`}>
                          <Avatar
                            src={interact?.user?.avatar}
                            size={50}
                            onClick={handleCancel}
                          >
                            ĐN
                          </Avatar>
                        </NavLink>
                      </div>
                      <NavLink to={`/profile/${interact?.user.userCode}`}>
                        <p className='font-semibold' onClick={handleCancel}>
                          {interact?.user?.userName}
                        </p>
                      </NavLink>
                      <img src='/assets/icon/tick.png' alt='' width={16} />
                    </div>
                    <Dropdown
                      menu={{
                        items: menuItems,
                      }}
                    >
                      <p onClick={(e) => e.preventDefault()}>
                        <BsThreeDots className='cursor-pointer' />
                      </p>
                    </Dropdown>
                  </div>
                  <div className='max-h-[220px] overflow-y-auto mt-6'>
                    <div className='flex items-start gap-4 pr-4'>
                      <NavLink to={`/profile/${interact?.user.userCode}`}>
                        <Avatar
                          src={interact?.user?.avatar}
                          size={50}
                          onClick={handleCancel}
                        >
                          ĐN
                        </Avatar>
                      </NavLink>
                      <div>
                        <NavLink to={`/profile/${interact?.user.userCode}`}>
                          <b onClick={handleCancel}>
                            {interact?.user?.userName}
                          </b>
                        </NavLink>{' '}
                        <span>{interact?.content}</span>
                      </div>
                    </div>
                    {comments &&
                      comments.map((comment: any) => (
                        <div
                          className='flex justify-between items-start mt-2'
                          key={comment?.id}
                        >
                          <div className='flex items-start gap-4'>
                            <NavLink to={`/profile/${comment?.user?.userCode}`}>
                              <Avatar
                                src={comment?.user?.avatar}
                                size={50}
                                onClick={handleCancel}
                              >
                                ĐN
                              </Avatar>
                            </NavLink>

                            <div>
                              <p className=' w-[340px] text-justify'>
                                <NavLink
                                  to={`/profile/${comment?.user?.userCode}`}
                                >
                                  <span
                                    className='font-semibold pr-2'
                                    onClick={handleCancel}
                                  >
                                    {comment?.user.userName}
                                  </span>{' '}
                                </NavLink>{' '}
                                <span className='break-words'>
                                  {comment?.content}
                                </span>
                              </p>
                              <div className='flex gap-4 text-[rgb(115,115,115)]'>
                                <p>{moment(comment?.cmt_date).fromNow(true)}</p>
                                {/* <p className='cursor-pointer'>
                                  {t('reply_tl')}
                                </p> */}
                              </div>
                            </div>
                          </div>
                          <ReactComment commentId={comment?.id} />
                        </div>
                      ))}
                  </div>
                </div>
                <div className=' inset-x-0 bg-white border-t border-gray-1 mt-2 pt-2 mb-2 mr-2 dark:bg-black'>
                  <div className='flex justify-between items-center'>
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
                          className='cursor-pointer'
                          onClick={() => handleReactPost(interact?.id)}
                        >
                          <AiOutlineHeart size={30} />
                        </p>
                      )}
                      <p className='cursor-pointer '>
                        {' '}
                        <FaRegComment size={26} />
                      </p>
                      <p className='cursor-pointer '>
                        {' '}
                        <FiSend size={26} />
                      </p>
                    </div>

                    <p className='cursor-pointer mr-2'>
                      <MdBookmarkBorder size={30} />
                    </p>
                  </div>
                  <div>
                    {reaction?.allReactPost?.length > 0 ? (
                      <p className='font-semibold text-[rgb(38,38,38)] mt-3 dark:text-white'>
                        {reaction?.allReactPost?.length} {t('likes_tl')}
                      </p>
                    ) : (
                      ''
                    )}

                    <p className='mt-2'>
                      {' '}
                      {moment(interact?.post_time).format('YYYY-MM-DD')}
                    </p>

                    <div className='flex justify-between mt-2 border-t border-gray-1 pt-4 pb-2 mr-1'>
                      <input
                        type='text'
                        placeholder={t('add_cmt_tl')}
                        value={commentUser}
                        className='outline-none w-[400px] dark:bg-black'
                        onChange={(e) => setCommentUser(e.target.value)}
                      />
                      {commentUser === '' ? (
                        <div className='font-semibold text-[rgb(201,224,239)] mr-2'>
                          {t('post_tl')}
                        </div>
                      ) : (
                        <button
                          className='font-semibold text-[rgb(0,149,246)] mr-2'
                          onClick={() =>
                            handleButtonPost(interact?.id, -1, commentUser)
                          }
                        >
                          {t('post_tl')}
                        </button>
                      )}
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

export default ModalPost;
