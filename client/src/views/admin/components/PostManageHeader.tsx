import { PostManageType } from '../../../constants/type';
import { useTranslation } from 'react-i18next';
import '../admin.css';
import { searchPostAPI } from '../../../services/admin';
import { useCallback } from 'react';
import { debounce } from '../../../constants/fn';
import '../admin.css';
import { useDispatch } from 'react-redux';
import { setPostView } from '../../../stores/slices/postSlice';

interface HeaderProp {
  currentPage: number;
  setCurrentPage: React.Dispatch<React.SetStateAction<number>>;
  setTotalPage: React.Dispatch<React.SetStateAction<number>>;
  fetchDataPosts: () => Promise<void>;
  currentTime: string;
}
const PostManageHeader = ({
  currentPage,
  setCurrentPage,
  setTotalPage,
  fetchDataPosts,
  currentTime,
}: HeaderProp) => {
  const { t } = useTranslation(['admin']);
  const dispatch = useDispatch();
  // Tìm kiếm người dùng
  const handleChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
    setCurrentPage(1);
    const input = event.target.value;
    if (input.trim()) {
      const response: any = await searchPostAPI(
        { q: input.trim() },
        currentPage
      );
      const { status, posts, total } = response || {};

      if (status === 200) {
        dispatch(setPostView(posts));
        setTotalPage(total);
      }
    } else {
      fetchDataPosts();
    }
  };
  const optimisedVersion = useCallback(debounce(handleChange, 300), []);

  return (
    <div className='my-6 mx-3'>
      <div className='ad-title'>
        <p className='font-bold text-2xl text-center my-2'>
          {t('post_mng_sb').toUpperCase()}
        </p>
        <p className='font-semibold'>{currentTime}</p>
      </div>
      <div className='flex items-center justify-between my-2'>
        <input
          type='text'
          placeholder={t('search')}
          className='w-1/3 outline-none dark:bg-gray-text-w rounded-sm py-1 border border-gray-text-b px-2 rounded-s'
          onChange={optimisedVersion}
        />

      </div>
    </div>
  );
};

export default PostManageHeader;
