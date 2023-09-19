import { AiFillHeart, AiOutlineHeart } from 'react-icons/ai';
import { useSelector } from 'react-redux';
import { getCurrentUser } from '../../stores/slices/userSlice';
import { useEffect, useState } from 'react';
import {
  deleteCommentAPI,
  getReactCmtAPI,
  reactCommentAPI,
} from '../../services/comment';

const ReactComment = ({ commentId }: any) => {
  const [isLikeComment, setIsLikeComment] = useState(false);
  const user = useSelector(getCurrentUser);

  const getReactCmt = async () => {
    const response: any = await getReactCmtAPI(commentId);
    const checkReact = response?.allReactCmt?.map(
      (userCode: any) => userCode?.user?.userCode === user?.userCode
    );
    if (checkReact?.length > 0) {
      setIsLikeComment(true);
    } else {
      setIsLikeComment(false);
    }
  };
  // Thả tim comment
  const handleReactComment = async (cmt_id: number) => {
    const newReact = {
      cmt_id: cmt_id,
      user_id: user?.id,
    };
    if (!isLikeComment) {
      const response: any = await reactCommentAPI(newReact);
      if (response?.status === 201) setIsLikeComment(true);
    } else {
      const response: any = await deleteCommentAPI(cmt_id, user?.id);
      if (response?.status === 200) setIsLikeComment(false);
    }
  };
  useEffect(() => {
    getReactCmt();
  }, []);

  return (
    <div>
      {isLikeComment ? (
        <p
          className='cursor-pointer text-red mr-2'
          onClick={() => handleReactComment(commentId)}
        >
          <AiFillHeart size={20} />
        </p>
      ) : (
        <p
          className='cursor-pointer mr-2'
          onClick={() => handleReactComment(commentId)}
        >
          <AiOutlineHeart size={20} />
        </p>
      )}
    </div>
  );
};

export default ReactComment;
