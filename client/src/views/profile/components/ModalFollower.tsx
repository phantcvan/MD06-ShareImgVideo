import '../style/style.css';
import { Modal } from 'antd';
import MainModal from './MainModal';
import { useTranslation } from 'react-i18next';
import { useState } from 'react';

const ModalFollower = ({
  isFollowersModalOpen,
  setIsFollowersModalOpen,
  follower,
  isFollower,
}: any) => {
  const { t } = useTranslation(['profile']);
  const [searchText, setSearchText] = useState('');

  const handleSearch = (e: any) => {
    setSearchText(e.target.value);
  };
  return (
    <div>
      <Modal
        title={t('followers_pf')}
        open={isFollowersModalOpen}
        onOk={() => setIsFollowersModalOpen(false)}
        onCancel={() => setIsFollowersModalOpen(false)}
        footer={[]}
        width={400}
        style={{ textAlign: 'center' }}
      >
        <div className='px-3 h-[400px] pt-1 overflow-y-auto border-t border-gray-1 dark:bg-black dark:text-white'>
          <div className='mt-2 input dark:bg-black'>
            <input
              type='text'
              placeholder={t('Search_pf')}
              className='dark:bg-black'
              value={searchText}
              onChange={handleSearch}
            />
          </div>
          {follower
            ?.filter((follow: any) =>
              follow.user.userName
                .toLowerCase()
                .includes(searchText.toLowerCase())
            )
            .map((follow: any) => (
              <div key={follow?.id}>
                <MainModal
                  follower={follow}
                  isFollower={isFollower}
                  setIsFollowersModalOpen={setIsFollowersModalOpen}
                />
              </div>
            ))}
        </div>
      </Modal>
    </div>
  );
};

export default ModalFollower;
