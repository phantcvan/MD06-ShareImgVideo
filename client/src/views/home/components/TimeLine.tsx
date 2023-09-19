import { useSelector } from 'react-redux';
import HeaderPosts from './timeline/HeaderPosts';
import Interact from './timeline/Interact';
import { getPostHome } from '../../../stores/slices/postSlice';

const TimeLine = () => {
  const posts = useSelector(getPostHome);
  const postHome = [...posts];
  return (
    <div>
      {postHome &&
        postHome.map((post: any, index: number) => (
          <div key={`${index}-${post?.id}`}>
            <div>
              <HeaderPosts headerPost={post} />
            </div>
            <Interact interact={post} />
          </div>
        ))}
    </div>
  );
};

export default TimeLine;
