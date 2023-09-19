import moment from 'moment';
import { AiFillHeart, AiOutlineHeart } from 'react-icons/ai';
import { useSelector } from 'react-redux';
import { getCurrentUser } from '../../../stores/slices/userSlice';
import { deleteCommentAPI, reactCommentAPI } from '../../../services/comment';
import { useState } from 'react';

interface CmtProp {
  cmt: any;
}

const Cmt = ({ cmt }: CmtProp) => {
  const [isLikeComment, setIsLikeComment] = useState(false);
  const user = useSelector(getCurrentUser);
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
  return (
    <div className='flex justify-between items-center mt-2'>
      <div className='flex items-center gap-2'>
        <div className='w-14 overflow-hidden origin-center rounded-full'>
          <img
            src={cmt?.user?.avatar}
            className='h-12 w-12 overflow-hidden origin-center rounded-full'
          />
        </div>
        <div className='flex flex-col'>
          <div className='flex gap-2'>
            <b>{cmt?.user.userName}</b> <span>{cmt?.content}</span>
          </div>
          <div className='flex gap-4 text-[rgb(115,115,115)]'>
            <p>{moment(cmt.cmt_date).fromNow(true)}</p>
          </div>
        </div>
      </div>
      {isLikeComment ? (
        <p
          className='cursor-pointer text-red mr-2'
          onClick={() => handleReactComment(cmt?.id)}
        >
          <AiFillHeart size={20} />
        </p>
      ) : (
        <p
          className='cursor-pointer mr-2'
          onClick={() => handleReactComment(cmt?.id)}
        >
          <AiOutlineHeart size={20} />
        </p>
      )}
    </div>
  );
};

export default Cmt;
