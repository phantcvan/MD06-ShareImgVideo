import { useDispatch, useSelector } from 'react-redux';
import {
  getShowPostManage,
  setShowPostManage,
} from '../../../stores/slices/appSlice';
import { useEffect, useState } from 'react';
import { getOnePostAPI } from '../../../services/post';
import ModalPostManage from '../ModalPostManage';
import { InteractType, PostManageType } from '../../../constants/type';
import { getCurrentUser } from '../../../stores/slices/userSlice';
import { getPostView, setPostView } from '../../../stores/slices/postSlice';
import { updateStatusPostAPI } from '../../../services/admin';
import { createNotiAPI, deleteNotiAPI } from '../../../services/user';

const Post = () => {
  const isVisible = useSelector(getShowPostManage);
  const dispatch = useDispatch();
  const [interact, setInteract] = useState<InteractType>();
  const [cmtLength, setCmtLength] = useState(0);
  const openModal = true;
  const user = useSelector(getCurrentUser);
  const postView = useSelector(getPostView);
  const closeModal = () => {
    dispatch(setShowPostManage(''));
  };
  const fetchData = async () => {
    const response: any = await getOnePostAPI(isVisible);
    const { status, post, cmt } = response || {};

    if (status === 200) {
      setInteract(post);
      setCmtLength(cmt.length);
    }
  };
  useEffect(() => {
    fetchData();
  }, [isVisible]);
  const handleHidePost = async (code: string) => {
    if (user?.status >= 2) {
      const response: any = await updateStatusPostAPI(code);
      const { status, postId } = response || {};
      if (status === 200) {
        // Gửi thông báo
        const postStatus = postView.find((pv: any) => pv.id === postId).status;
        const newNoti = {
          user_id: interact?.user?.id || 0,
          interact_id: user?.id,
          type: 'lock',
          post_id: null,
        };
        if (postStatus === 0) {
          await createNotiAPI(newNoti);
        } else {
          await deleteNotiAPI(newNoti);
        }
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
        closeModal();
      }
    }
  };

  return (
    <div className=''>
      <ModalPostManage
        isVisible={openModal}
        closeModal={closeModal}
        interact={interact}
        commentLength={cmtLength}
        handleHidePost={handleHidePost}
      />
    </div>
  );
};

export default Post;
