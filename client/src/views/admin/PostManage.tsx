import { useEffect, useState } from 'react';
import { setPickMenu, setShowPostManage } from '../../stores/slices/appSlice';
import { useDispatch, useSelector } from 'react-redux';
import { allPostsAPI, updateStatusPostAPI } from '../../services/admin';
import { Button, Popconfirm, Space, Table, TablePaginationConfig } from 'antd';
import PostManageHeader from './components/PostManageHeader';
import { MediaType, PostManageType } from '../../constants/type';
import { useTranslation } from 'react-i18next';
import ReactPlayer from 'react-player';
import moment from 'moment';
import { getPostView, setPostView } from '../../stores/slices/postSlice';
import { createNotiAPI, deleteNotiAPI } from '../../services/user';
import { getCurrentUser } from '../../stores/slices/userSlice';

interface PostProp {
  currentTime: string;
}
const PostManage = ({ currentTime }: PostProp) => {
  const dispatch = useDispatch();
  const postView = useSelector(getPostView);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPage, setTotalPage] = useState(1);
  const { t } = useTranslation(['admin']);
  const currentUser = useSelector(getCurrentUser);
  // update title
  const updateTitle = () => {
    document.title = 'Post Manage ・ Instagram';
  };
  // Thay đổi title của trang và set Pick
  useEffect(() => {
    dispatch(setPickMenu('post_mng_sb'));
    updateTitle();
  }, []);

  // Lấy về thông tin của toàn bộ post
  const fetchDataPosts = async () => {
    const postResponse: any = await allPostsAPI(currentPage);
    const { status, posts, total } = postResponse || {};
    if (status === 200) {
      setTotalPage(total);
      dispatch(setPostView(posts));
    }
  };
  useEffect(() => {
    fetchDataPosts();
  }, [currentPage]);
  const handleTableChange = (pagination: TablePaginationConfig) => {
    const current = pagination.current || 1;
    setCurrentPage(current);
  };

  const handleChangeStatus = async (record: PostManageType) => {
    const response: any = await updateStatusPostAPI(record.postCode);
    const { status, postId } = response || {};
    if (status === 200) {
      // Gửi thông báo
      const postStatus = postView.find((pv: any) => pv.id === postId).status;
      const newNoti = {
        user_id: record?.userId,
        interact_id: currentUser?.id,
        type: 'lock',
        post_id: null,
      };
      if (postStatus === 1) {
        await createNotiAPI(newNoti);
      } else {
        await deleteNotiAPI(newNoti);
      }
      // update postView
      let updatedData: PostManageType[] = [];
      updatedData = postView?.map((post: PostManageType) => {
        if (post.id === record.id) {
          if (record.status === 0) return { ...post, status: 1 };
          if (record.status === 1) return { ...post, status: 0 };
        }
        return post;
      });
      dispatch(setPostView(updatedData));
    }
  };

  // show modal Post
  const handleShowPost = (code: string) => {
    dispatch(setShowPostManage(code));
  };

  const columns = [
    {
      title: `${t('id_tbl')}`,
      key: 'id',
      render: (_: any, __: any, index: number) =>
        index + (currentPage - 1) * 10 + 1,
    },
    {
      title: `${t('Media')}`,
      key: 'media',
      render: (text: string, record: PostManageType) => (
        <div className='w-fit flex flex-wrap gap-2'>
          {record.media.slice(0, 3).map((mediaItem: MediaType, index: number) =>
            mediaItem.type === 'video' ? (
              <div
                className='h-10 w-fit aspect-video overflow-hidden object-cover border'
                key={index}
              >
                <ReactPlayer
                  url={mediaItem.mediaUrl}
                  width={'100%'}
                  height={'100%'}
                  playing={false}
                />
              </div>
            ) : (
              <img
                key={index}
                src={mediaItem.mediaUrl}
                alt={`Media ${index}`}
                className='w-10 h-10 overflow-hidden object-cover border'
              />
            )
          )}
        </div>
      ),
    },
    {
      title: `${t('content_tbl')}`,
      dataIndex: 'content',
      key: 'content',
      sorter: (a: PostManageType, b: PostManageType) =>
        a.content.localeCompare(b.content),
      render: (text: string, record: PostManageType) => (
        <div
          className='w-[200px] text-ellipsis overflow-hidden whitespace-pre cursor-pointer hover:text-blue-chat'
          onClick={() => handleShowPost(record.postCode)}
        >
          <p className=''>{text}</p>
        </div>
      ),
    },
    {
      title: `${t('userName_tbl')}`,
      dataIndex: 'userName',
      key: 'userName',
      sorter: (a: PostManageType, b: PostManageType) =>
        a.userName.localeCompare(b.userName),
      render: (text: string, record: PostManageType) => (
        <div className='min-w-[140px] flex items-center gap-1 overflow-hidden object-cover'>
          <img
            src={record.avatar}
            alt={text}
            className='w-10 h-10 rounded-full mr-2 overflow-hidden object-cover'
          />
          <div className='w-20 text-ellipsis overflow-hidden whitespace-pre'>
            <a
              href={`/profile/${record.userCode}`}
              target='_blank'
              rel='noopener noreferrer'
              className=''
            >
              {text}
            </a>
          </div>
        </div>
      ),
    },
    {
      title: `${t('date_tbl')}`,
      dataIndex: 'date',
      key: 'date',
      sorter: (a: PostManageType, b: PostManageType) =>
        a.date.localeCompare(b.date),

      render: (text: string) => moment(text).format('DD-MM-YYYY'),
    },
    {
      title: `${t('action_tbl')}`,
      key: 'action',
      render: (record: PostManageType) => (
        <div className='w-[120px]'>
          <Space size='middle'>
            {record.status === 1 ? (
              <Popconfirm
                title={t('hide_post')}
                onConfirm={() => handleChangeStatus(record)}
                okText='Yes'
                cancelText='No'
              >
                <Button type='primary'>{t('hide')}</Button>
              </Popconfirm>
            ) : (
              <Popconfirm
                title={t('show_post')}
                onConfirm={() => handleChangeStatus(record)}
                okText='Yes'
                cancelText='No'
              >
                <Button type='primary' danger>
                  {t('show')}
                </Button>
              </Popconfirm>
            )}
          </Space>
        </div>
      ),
    },
  ];
  return (
    <div className='max-w-full'>
      <PostManageHeader
        currentPage={currentPage}
        setCurrentPage={setCurrentPage}
        setTotalPage={setTotalPage}
        fetchDataPosts={fetchDataPosts}
        currentTime={currentTime}
      />
      <div className='m-3'>
        <Table
          dataSource={postView}
          columns={columns}
          pagination={{
            pageSize: 10,
            current: currentPage,
            total: totalPage,
          }}
          onChange={handleTableChange}
          rowKey='id'
        />
      </div>
    </div>
  );
};

export default PostManage;
