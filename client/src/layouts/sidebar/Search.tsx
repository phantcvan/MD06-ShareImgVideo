import { useCallback, useState } from 'react';
import '../../index.css';
import { BiSearch } from 'react-icons/bi';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { searchAPI } from '../../services/user';
import { MiniUserType } from '../../constants/type';
import { useSelector } from 'react-redux';
import { getCurrentUser } from '../../stores/slices/userSlice';
import { debounce, handleNumber } from '../../constants/fn';
import { PATH } from '../../services/list-path';

const Search = () => {
  const { t } = useTranslation(['home']);
  const [searchResult, setSearchResult] = useState<MiniUserType[]>([]);
  const currentUser = useSelector(getCurrentUser);
  const [keyword, setKeyword] = useState('');

  const handleInputKeyword = (e: any) => {
    const inputSearch: string = e.target.value.trim().replace(/\s+/g, ' ');
    setKeyword(e.target.value);
    handleSearch(inputSearch);
  };

  const handleSearch = useCallback(
    debounce((inputSearch: string) => handleLoadData(inputSearch), 500),
    []
  );

  const handleLoadData = async (inputSearch: string) => {
    if (inputSearch) {
      const response: any = await searchAPI({ q: inputSearch });
      const { status, users } = response || {};

      if (status === 200) {
        const filterUser = users.filter(
          (user: MiniUserType) => user.id !== currentUser?.id
        );
        setSearchResult(filterUser);
      }
    } else {
      setSearchResult([]);
    }
  };

  return (
    <div
      className={`box_shadow animate-slide-right bg-white dark:bg-black dark:border-r dark:border-gray-setting`}
    >
      <div className='flex flex-col gap-9'>
        <span className='text-2xl font-semibold ml-4'>{t('search')}</span>
        <div
          className='flex items-center dark:bg-gray-setting rounded-md bg-gray-hover mx-4 mb-3
        dark:hover:bg-gray-hover-dark'
        >
          <span className='px-3'>
            <BiSearch size={21} />
          </span>
          <input
            type='text'
            onChange={handleInputKeyword}
            placeholder='Search'
            className='border-none outline-none h-10 w-[100%] pl-2 dark:bg-gray-setting rounded-md
        bg-gray-hover dark:hover:bg-gray-hover-dark'
          />
        </div>
      </div>
      <div className='mx-4 flex flex-col items-center justify-center'>
        {searchResult.length > 0
          ? searchResult.map((result) => (
              <div
                className='flex flex-col gap-1 w-full hover:bg-gray-hover dark:hover:bg-gray-hover-dark
            p-2 rounded-md'
                key={result.id}
              >
                <Link
                  to={`${PATH.PROFILE.replace(':userCode', result.userCode)}`}
                >
                  <div className='flex gap-3'>
                    <div className='w-[44px] h-[44px] rounded-full'>
                      <img
                        src={result.avatar}
                        alt=''
                        className='w-[44px] h-[44px] overflow-hidden object-cover rounded-full'
                      />
                    </div>
                    <div className='flex flex-col'>
                      <span className='font-semibold'>{result.userName}</span>
                      <span className='text-sm text-gray-text-w'>
                        {result.fullName} •{' '}
                        {handleNumber(Number(result.follower)) || 0}{' '}
                        {t('followers')}
                      </span>
                    </div>
                  </div>
                </Link>
              </div>
            ))
          : keyword && <span>{t('no_result')}</span>}
      </div>
    </div>
  );
};

export default Search;
