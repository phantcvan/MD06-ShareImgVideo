import { useEffect, useState } from 'react';
import StoryHome from './components/StoryHome';
import Suggestions from './components/Suggestions';
import TimeLine from './components/TimeLine';
import { getPostAPI } from '../../services/post';
import { useLocation } from 'react-router';
import { useDispatch, useSelector } from 'react-redux';
import {
  getEditPost,
  setLocation,
  setPickMenu,
} from '../../stores/slices/appSlice';
import { getCurrentUser } from '../../stores/slices/userSlice';
import { getPostHome, setPostHome } from '../../stores/slices/postSlice';

let callingStart = 0;

const Home = () => {
  const [start, setStart] = useState(1);
  const [lastPage, setLastPage] = useState(false);
  const [loading, setLoading] = useState(false);
  const posts = useSelector(getPostHome);

  // Lắng nghe đường dẫn để sử dụng footer
  const location = useLocation();
  const dispatch = useDispatch();
  const editPost = useSelector(getEditPost);

  useEffect(() => {
    const currentPath = location.pathname;
    const setLocationAction = setLocation(currentPath);
    dispatch(setLocationAction);
  }, [location, dispatch]);

  // Lấy thông tin user
  const currentUser = useSelector(getCurrentUser);

  // Lấy bài post về
  const getPost = async () => {
    if (start === callingStart) return;

    setLoading(true);
    if (currentUser?.id) {
      callingStart = start;
      const response: any = await getPostAPI(start, currentUser?.id);
      callingStart = 0;
      if (Array.isArray(response.posts)) {
        const uniquePosts = response.posts.filter((post: any) => {
          return !posts?.find((existingPost: any) => {
            existingPost?.id === post?.id;
          });
        });

        let newPost = [];
        if (start === 1) {
          newPost = uniquePosts;
        } else {
          newPost = [...posts, ...uniquePosts];
        }
        dispatch(setPostHome(newPost));
      } else {
        dispatch(setPostHome(response.posts));
      }
      setLastPage(response?.lastPage);
      if (!response?.lastPage) {
        setStart((prev) => prev + 1);
      }
    }
    setTimeout(() => {
      setLoading(false);
    }, 1000);
  };
  useEffect(() => {
    window.addEventListener('scroll', handleScroll);
    return () => {
      window.removeEventListener('scroll', handleScroll);
      callingStart = 0;
    };
  }, [loading, lastPage]);

  const handleScroll = () => {
    const scrollTop = Math.max(
      document.documentElement.scrollTop,
      document.body.scrollTop
    );
    const scrollHeight = Math.max(
      document.documentElement.scrollHeight,
      document.body.scrollHeight
    );
    const clientHeight = document.documentElement.clientHeight;
    if (
      scrollTop + clientHeight >= scrollHeight - 50 &&
      !loading &&
      !lastPage
    ) {
      getPost();
    }
  };

  useEffect(() => {
    getPost();
  }, [currentUser, editPost]);

  // update title
  const updateTitle = () => {
    document.title = 'Instagram';
  };

  // Thay đổi title của trang và set Pick
  useEffect(() => {
    dispatch(setPickMenu('home_sb'));
    updateTitle();
  }, []);

  return (
    <div className='home flex w-full justify-between mb-5 bg-white dark:bg-black'>
      <div className='w-2/3 flex flex-col'>
        <div className='ml-10'>
          {' '}
          <StoryHome />
        </div>
        <div className='flex items-center justify-center mt-5'>
          {' '}
          <TimeLine />
        </div>
        {loading && <div className='text-center mt-4'></div>}
      </div>
      <div className='w-[30%]'>
        <Suggestions />
      </div>
    </div>
  );
};

export default Home;
