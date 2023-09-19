import { useState } from 'react';
import AddMedia from './AddMedia';
import AddTitle from './AddTitle';
import { useDispatch, useSelector } from 'react-redux';
import { setCreatePost, setEditPost } from '../../stores/slices/appSlice';
import { getStep, setStep } from '../../stores/slices/postSlice';

const CreatePost = () => {
  const [fileMedia, setFileMedia] = useState();
  const [imgUrl, setImgUrl] = useState('');
  const dispatch = useDispatch();
  const handleCancel = () => {
    dispatch(setCreatePost(false));
    dispatch(setEditPost(false));
    dispatch(setStep(1));
  };
  const step = useSelector(getStep);

  return (
    <div className='bg-overlay-40 fixed top-0 w-screen h-full flex items-center z-30'>
      <div
        onClick={handleCancel}
        className='absolute top-0 h-screen w-screen'
      ></div>
      <div>
        {step === 1 ? (
          <AddMedia setFileMedia={setFileMedia} setImgUrl={setImgUrl} />
        ) : (
          <AddTitle fileMedia={fileMedia} imgUrl={imgUrl} />
        )}
      </div>
    </div>
  );
};

export default CreatePost;
