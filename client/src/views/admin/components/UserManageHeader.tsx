import { UserManageType } from '../../../constants/type';
import { useTranslation } from 'react-i18next';
import { Button } from 'antd';
import '../admin.css';
import { searchAPI } from '../../../services/user';
import { useCallback } from 'react';
import { debounce } from '../../../constants/fn';
import { allUsersByRoleAPI } from '../../../services/admin';
import '../admin.css';

interface HeaderProp {
  setUserView: React.Dispatch<React.SetStateAction<UserManageType[]>>;
  currentPage: number;
  setCurrentPage: React.Dispatch<React.SetStateAction<number>>;
  setTotalPage: React.Dispatch<React.SetStateAction<number>>;
  fetchDataUsers: () => Promise<void>;
  currentTime: string;
}
const UserManageHeader = ({
  setUserView,
  currentPage,
  setCurrentPage,
  setTotalPage,
  fetchDataUsers,
  currentTime,
}: HeaderProp) => {
  const { t } = useTranslation(['admin']);
  // Tìm kiếm người dùng
  const handleChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
    setCurrentPage(1);
    const input = event.target.value;
    if (input.trim()) {
      const response: any = await searchAPI({ q: input.trim() });
      const { status, users, total } = response || {};
      if (status === 200) {
        setUserView(users);
        setTotalPage(total);
      }
    } else {
      fetchDataUsers();
    }
  };
  const optimisedVersion = useCallback(debounce(handleChange, 300), []);

  const handleChoice = async (role: number) => {
    setCurrentPage(1);
    const usersResponse: any = await allUsersByRoleAPI(role, currentPage);
    const { status, users, total } = usersResponse || {};
    if (status === 200) {
      setUserView(users);
      setTotalPage(total);
    }
  };
  return (
    <div className='my-6 mx-3'>
      <div className='ad-title'>
        <p className='font-bold text-2xl text-center my-2'>
          {t('user_mng_sb').toUpperCase()}
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
        <div className='flex items-center gap-2'>
          <p>{t('view_all')}</p>
          <Button
            type='text'
            style={{ backgroundColor: '#0A90DB', color: 'white' }}
            onClick={() => handleChoice(-1)}
          >
            {t('all')}
          </Button>
          <Button
            type='text'
            style={{ backgroundColor: '#F5557C', color: 'white' }}
            onClick={() => handleChoice(3)}
          >
            Admin
          </Button>
          <Button
            type='text'
            style={{ backgroundColor: '#71BF76', color: 'white' }}
            onClick={() => handleChoice(2)}
          >
            Moderator
          </Button>
          <Button
            type='text'
            style={{ backgroundColor: 'gray', color: 'white' }}
            onClick={() => handleChoice(1)}
          >
            {t('user_tbl')}
          </Button>
          <Button
            type='text'
            style={{ backgroundColor: '#333333', color: 'white' }}
            onClick={() => handleChoice(0)}
          >
            {t('banned_tbl')}
          </Button>
        </div>
      </div>
    </div>
  );
};

export default UserManageHeader;
