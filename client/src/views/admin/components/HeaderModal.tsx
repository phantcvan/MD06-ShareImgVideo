import { Avatar, Dropdown } from 'antd';
import { deletePostAPI } from '../../../services/post';
import { useDispatch, useSelector } from 'react-redux';
import {
  getPostView,
  setPostView,
  setStep,
} from '../../../stores/slices/postSlice';
import {
  getCurrentUser,
  getFollows,
  setFollows,
} from '../../../stores/slices/userSlice';
import { notiSuccess } from '../../../constants/notification';
import {
  setCreatePost,
  setEditPost,
  setPost,
} from '../../../stores/slices/appSlice';
import { useTranslation } from 'react-i18next';
import { updateStatusPostAPI } from '../../../services/admin';
import { BsThreeDots } from 'react-icons/bs';
import { PostManageType } from '../../../constants/type';
import { useEffect, useState } from 'react';
import { deleteFollowAPI, profileFollowAPI } from '../../../services/follow';
import {
  createFollowAPI,
  createNotiAPI,
  deleteNotiAPI,
} from '../../../services/user';

const HeaderModal = ({ post, closeModal, handleHidePost }: any) => {
  const postView = useSelector(getPostView);
  const user = useSelector(getCurrentUser);
  const dispatch = useDispatch();
  const { t } = useTranslation(['home']);
  const [isFollow, setIsFollow] = useState(false);
  const follows = useSelector(getFollows);
  // Kiểm tra follow
  const checkFollow = async () => {
    const response = await profileFollowAPI(user?.id, post?.user?.id);
    const { status } = response || {};
    if (status === 200) setIsFollow(true);
    else if (status === 404) setIsFollow(false);
  };
  useEffect(() => {
    checkFollow();
  }, [user, post]);

  // Theo dõi, bỏ theo dõi
  const handleFollow = async () => {
    const data = {
      user_id: user?.id,
      friend_id: post.user?.id,
      status: 1,
    };
    const newNoti = {
      user_id: post.user?.id,
      interact_id: user?.id,
      type: 'follow',
      post_id: null,
    };

    if (!isFollow) {
      // gửi thông báo cho người được follow
      const [followRes, notiRes] = await Promise.all([
        createFollowAPI(data),
        createNotiAPI(newNoti),
      ]);
      if (followRes.status !== 404) {
        setIsFollow(true);
        const newFollowArr = [...follows, post.user?.id];
        dispatch(setFollows(newFollowArr));
      }
    } else {
      // xoá follow và notification
      const [deleteFollowRes, notiRes] = await Promise.all([
        deleteFollowAPI(user?.id, post?.user?.id),
        deleteNotiAPI(newNoti),
      ]);
      if (deleteFollowRes.status === 200) {
        setIsFollow(false);
        const newFollowArr = follows.filter(
          (id: number) => id !== post?.user?.id
        );
        dispatch(setFollows(newFollowArr));
      }
    }
  };
  // Xóa bài viết
  const handleDeletePost = async (postCode: string) => {
    const [removePost] = await Promise.all([deletePostAPI(postCode)]);
    const { status } = removePost || {};
    if (status === 200) notiSuccess(`${t('NotiS_p')}!`);
    const newPosts = postView.filter((post: any) => post.postCode !== postCode);
    dispatch(setPostView(newPosts));
    closeModal();
  };

  // Chỉnh sửa bài viết
  const handleEdit = async () => {
    closeModal();
    dispatch(setCreatePost(true));
    dispatch(setPost(post));
    dispatch(setStep(2));
  };

  // Ẩn bài viết

  const menuItems = [];
  if (post?.user?.userCode === user?.userCode) {
    menuItems.push(
      {
        key: '1',
        label: <p onClick={handleEdit}>{t('edit')}</p>,
      },
      {
        key: '2',
        label: (
          <p onClick={() => handleDeletePost(post?.postCode)}>{t('delete')}</p>
        ),
      }
    );
  }
  if (user.status >= 2) {
    menuItems.push({
      key: '3',
      label: (
        <p onClick={() => handleHidePost(post?.postCode)}>
          {post?.status === 1 ? `${t('hide_post')}` : `${t('show_post')}`}
        </p>
      ),
    });
  }

  return (
    <div className='flex items-center justify-between  border-b pb-2 mr-3'>
      <div className='flex items-center gap-2 my-3 '>
        <div>
          <Avatar src={post?.user?.avatar} size={50}>
            ĐN
          </Avatar>
        </div>
        <p className='font-semibold'>{post?.user?.userName}</p>
        <img src='/assets/icon/tick.png' alt='' width={18} />

        {post?.user?.userCode === user?.userCode ? (
          ''
        ) : (
          <div className='flex' onClick={handleFollow}>
            <p>{'・'}</p>
            <p className='text-[rgb(0,149,246)] cursor-pointer'>
              {isFollow ? t('following') : t('follow')}
            </p>
          </div>
        )}
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
  );
};

export default HeaderModal;
