import { useEffect, useState } from 'react';
import { setPickMenu } from '../../stores/slices/appSlice';
import { useDispatch, useSelector } from 'react-redux';
import {
  Space,
  Table,
  Tag,
  Popconfirm,
  Button,
  TablePaginationConfig,
} from 'antd';
import moment from 'moment';
import './admin.css';
import UserManageHeader from './components/UserManageHeader';
import { UserManageType } from '../../constants/type';
import { getCurrentUser } from '../../stores/slices/userSlice';
import { allUsersByRoleAPI, updateStatusAPI } from '../../services/admin';
import { useTranslation } from 'react-i18next';
import { PATH } from '../../services/list-path';

interface UserManageProp {
  currentTime: string;
}
const UserManage = ({ currentTime }: UserManageProp) => {
  const { t } = useTranslation(['admin']);
  const dispatch = useDispatch();
  const [usersView, setUserView] = useState<UserManageType[]>([]);
  const currentUser = useSelector(getCurrentUser);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPage, setTotalPage] = useState(1);

  // update title
  const updateTitle = () => {
    document.title = 'User Manage ・ Instagram';
  };
  // Thay đổi title của trang và set Pick
  useEffect(() => {
    dispatch(setPickMenu('user_mng_sb'));
    updateTitle();
  }, []);

  // Lấy về thông tin của toàn bộ user
  const fetchDataUsers = async () => {
    const usersResponse: any = await allUsersByRoleAPI(-1, currentPage);
    const { status, users, total } = usersResponse || {};
    if (status === 200) {
      setUserView(users);
      setTotalPage(total);
    }
  };

  useEffect(() => {
    fetchDataUsers();
  }, [currentPage]);
  // Chuyển quyền user
  const handleRoleChange = async (record: UserManageType, type: string) => {
    const data = {
      userCode: record.userCode,
      admin_id: currentUser?.id,
      type,
    };
    const response: any = await updateStatusAPI(data);
    const { status } = response || {};
    if (status === 200) {
      let updatedUsersData: UserManageType[] = [];
      if (type === 'ban') {
        updatedUsersData = usersView.map((user) => {
          if (user.id === record.id) {
            if (record.status === 0) return { ...user, status: 1 };
            if (record.status === 1 || record.status === 2)
              return { ...user, status: 0 };
          }
          return user;
        });
      } else if (type === 'mod') {
        updatedUsersData = usersView.map((user) => {
          if (user.id === record.id) {
            if (record.status === 2) return { ...user, status: 1 };
            if (record.status === 1) return { ...user, status: 2 };
          }
          return user;
        });
      }
      setUserView(updatedUsersData);
    }
  };

  const columns = [
    {
      title: `${t('id_tbl')}`,
      key: 'id',
      render: (_: any, __: any, index: number) =>
        index + (currentPage - 1) * 10 + 1,
    },
    {
      title: `${t('avatar_tbl')}`,
      key: 'avatar',
      render: (record: UserManageType) => (
        <a
          href={`${PATH.PROFILE.replace(':userCode', record.userCode)}`}
          target='_blank'
          rel='noopener noreferrer'
        >
          <img
            src={record.avatar}
            alt={record.userName}
            className='w-10 h-10 overflow-hidden object-cover rounded-full'
          />
        </a>
      ),
    },
    {
      title: `${t('userName_tbl')}`,
      dataIndex: 'userName',
      key: 'userName',
      sorter: (a: UserManageType, b: UserManageType) =>
        a.userName.localeCompare(b.userName),
      render: (text: string, record: UserManageType) => (
        <div className='w-[100px] text-ellipsis overflow-hidden whitespace-pre'>
          <a
            href={`${PATH.PROFILE.replace(':userCode', record.userCode)}`}
            target='_blank'
            rel='noopener noreferrer'
            className=''
          >
            <div className='flex flex-col'>
              <div>{text}</div>
              <div>{record.fullName}</div>
            </div>
          </a>
        </div>
      ),
    },
    {
      title: `${t('date_join_tbl')}`,
      dataIndex: 'date_join',
      key: 'date_join',
      render: (text: string) => moment(text).format('DD-MM-YYYY'),
    },
    {
      title: `${t('email_tbl')}`,
      dataIndex: 'email',
      key: 'email',
      sorter: (a: UserManageType, b: UserManageType) =>
        a.email.localeCompare(b.email),
      render: (text: string) => (
        <div className='w-[150px] text-ellipsis overflow-hidden whitespace-pre'>
          {text}
        </div>
      ),
    },
    {
      title: `${t('role_tbl')}`,
      dataIndex: 'status',
      key: 'status',
      sorter: (a: UserManageType, b: UserManageType) => a.status - b.status,
      render: (status: number) => (
        <div className='w-[80px]'>
          <Tag
            color={
              status === 3
                ? 'red'
                : status === 2
                ? 'green'
                : status === 1
                ? 'gray'
                : 'black'
            }
          >
            {status === 3
              ? 'Admin'
              : status === 2
              ? 'Moderator'
              : status === 1
              ? 'User'
              : 'Banned'}
          </Tag>
        </div>
      ),
    },
    {
      title: `${t('action_tbl')}`,
      key: 'action',
      render: (record: UserManageType) => (
        <div className='w-[200px]'>
          <Space size='middle'>
            {record.status === 1 && currentUser?.status > record.status ? (
              <Popconfirm
                title={t('change_role_mod')}
                onConfirm={() => handleRoleChange(record, 'mod')}
                okText='Yes'
                cancelText='No'
              >
                <Button type='primary'>{t('change_role')}</Button>
              </Popconfirm>
            ) : (
              record.status === 2 &&
              currentUser?.status === 3 && (
                <Popconfirm
                  title={t('change_role_user')}
                  onConfirm={() => handleRoleChange(record, 'mod')}
                  okText='Yes'
                  cancelText='No'
                >
                  <Button type='primary'>{t('change_role')}</Button>
                </Popconfirm>
              )
            )}
            {(record.status === 1 || record.status === 2) &&
            currentUser?.status > record.status ? (
              <Popconfirm
                title={t('ban_user')}
                onConfirm={() => handleRoleChange(record, 'ban')}
                okText='Yes'
                cancelText='No'
              >
                <Button type='primary'>{t('ban')}</Button>
              </Popconfirm>
            ) : (
              record.status === 0 &&
              currentUser?.status >= 2 && (
                <Popconfirm
                  title={t('unlock_user')}
                  onConfirm={() => handleRoleChange(record, 'ban')}
                  okText='Yes'
                  cancelText='No'
                >
                  <Button type='primary' danger>
                    {t('unlock')}
                  </Button>
                </Popconfirm>
              )
            )}
          </Space>
        </div>
      ),
    },
  ];
  const handleTableChange = (pagination: TablePaginationConfig) => {
    const current = pagination.current || 1;
    setCurrentPage(current);
  };

  return (
    <div className='max-w-full mt-10'>
      <UserManageHeader
        setUserView={setUserView}
        currentPage={currentPage}
        setCurrentPage={setCurrentPage}
        setTotalPage={setTotalPage}
        fetchDataUsers={fetchDataUsers}
        currentTime={currentTime}
      />
      <div className='m-3'>
        <Table
          dataSource={usersView}
          columns={columns}
          pagination={{
            pageSize: 10,
            current: currentPage,
            total: totalPage,
          }}
          onChange={handleTableChange}
          rowKey="id"
        />
      </div>
    </div>
  );
};

export default UserManage;
