import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { setPickMenu } from '../../stores/slices/appSlice';
import { Chart } from './components/Chart';
import { getPostQuantityAPI, getUserQuantityAPI } from '../../services/admin';
import { getCurrentUser } from '../../stores/slices/userSlice';
import { findMax, findStep, findSum } from '../../constants/fn';
import { useNavigate } from 'react-router';
import { PATH } from '../../services/list-path';
import { getAccessAPI } from '../../services/user';
import './admin.css';
import Total from './components/Total';
import { useTranslation } from 'react-i18next';

interface DashboardProp {
  currentTime: string;
}
const Dashboard = ({ currentTime }: DashboardProp) => {
  const currentUser = useSelector(getCurrentUser);
  const [labels, setLabels] = useState<string[]>([]);
  const [dataUser, setDataUser] = useState<number[]>([]);
  const [totalUsers, setTotalUsers] = useState(0);
  const [totalPosts, setTotalPosts] = useState(0);
  const [totalImgs, setTotalImgs] = useState(0);
  const [totalVideos, setTotalVideos] = useState(0);
  const [totalAccess, setTotalAccess] = useState(0);
  const [userStep, setUserStep] = useState(1);
  const [accessStep, setAccessStep] = useState(1);
  const [postStep, setPostStep] = useState(1);
  const [dataPost, setDataPost] = useState<number[]>([]);
  const [dataAccess, setDataAccess] = useState<number[]>([]);
  const currentDate = new Date();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { t } = useTranslation(['admin']);
  // update title
  const updateTitle = () => {
    document.title = 'Dashboard ・ Instagram';
  };
  // Thay đổi title của trang và set Pick
  useEffect(() => {
    dispatch(setPickMenu('admin_sb'));
    updateTitle();
  }, []);

  // Lấy về số lượng user đăng ký theo từng tháng
  const fetchData = async () => {
    const [userQuantityResponse, postQuantityResponse, accessResponse] =
      await Promise.all([
        getUserQuantityAPI(),
        getPostQuantityAPI(),
        getAccessAPI(),
      ]);
    // tạo labels
    const labelArr: string[] = [];
    for (let i = 0; i < 6; i++) {
      const year = currentDate.getFullYear();
      const month = currentDate.getMonth() + 1;
      const formattedMonth = `${year}-${month.toString().padStart(2, '0')}`;
      labelArr.unshift(formattedMonth);
      currentDate.setMonth(currentDate.getMonth() - 1);
    }
    setLabels(labelArr);
    // Tạo thành mảng chứa số lượng người đăng ký mới trong 6 tháng gần nhất
    if (Array.isArray(userQuantityResponse)) {
      const userCount = Array.from({ length: labels.length }, () => 0);
      userQuantityResponse.forEach((item: any) => {
        const index = labelArr.indexOf(item.month);
        if (index !== -1) {
          userCount[index] = Number(item.count) || 0;
        } else userCount[index] = 0;
      });
      setDataUser(userCount);
      setTotalUsers(findSum(userQuantityResponse, 'count'));
      const max = findMax(userCount);
      const step = findStep(max);
      setUserStep(step);
    }
    // Tạo thành mảng chứa số lượng bài đăng mới trong 6 tháng gần nhất
    if (Array.isArray(postQuantityResponse)) {
      const postCount = Array.from({ length: labels.length }, () => 0);
      postQuantityResponse.forEach((item: any) => {
        const index = labelArr.indexOf(item.month);
        if (index !== -1) {
          postCount[index] = Number(item.postCount);
        } else postCount[index] = 0;
      });
      setDataPost(postCount);
      setTotalPosts(findSum(postQuantityResponse, 'postCount'));
      setTotalImgs(findSum(postQuantityResponse, 'imageCount'));
      setTotalVideos(findSum(postQuantityResponse, 'videoCount'));
      const max = findMax(postCount);
      const step = findStep(max);
      setPostStep(step);
    }
    // Tạo thành mảng chứa số lượng truy cập
    if (Array.isArray(accessResponse)) {
      const accessCount = Array.from({ length: labelArr.length }, () => 0);
      for (const [index, label] of labelArr.entries()) {
        const matchingObject = accessResponse.find(
          (obj) => obj.month === label
        );
        if (matchingObject) {
          accessCount[index] = matchingObject.views;
        }
      }
      setDataAccess(accessCount);
      setTotalAccess(findSum(accessResponse, 'views'));
      const max = findMax(accessCount);
      const step = findStep(max);
      setAccessStep(step);
    }
  };

  useEffect(() => {
    if (currentUser?.status >= 2) {
      fetchData();
    } else {
      navigate(PATH.HOME);
    }
  }, [currentUser]);

  return (
    <div className='flex-col w-full justify-between mt-10 px-5'>
      <div className='ad-title dark:border-y dark:border-r dark:border-gray-text-w'>
        <p className='font-bold text-2xl text-center my-2'>
          {t('admin_sb').toUpperCase()}
        </p>
        <p className='font-semibold'>{currentTime}</p>
      </div>
      <div className='grid gap-5 sm:grid-cols-1 lg:grid-cols-2 justify-start items-start'>
        <Total
          totalUsers={totalUsers}
          totalPosts={totalPosts}
          totalImgs={totalImgs}
          totalVideos={totalVideos}
          totalAccess={totalAccess}
        />
        <div className='flex flex-col '>
          <div className='flex items-center justify-center sm:h-[35vh] xl:h-[30vh] mt-3'>
            <Chart
              labels={labels}
              dataChart={dataUser}
              title={t('user_title_chart')}
              borderColor='#48AD81'
              bgColor='#94E3CE'
              step={userStep}
            />
          </div>
          <div className='flex items-center justify-center sm:h-[35vh] xl:h-[30vh] mt-3'>
            <Chart
              labels={labels}
              dataChart={dataPost}
              title={t('post_title_chart')}
              borderColor='#079DDA'
              bgColor='#99D9F4'
              step={postStep}
            />
          </div>
          <div className='flex items-center justify-center sm:h-[35vh] xl:h-[30vh] mt-3'>
            <Chart
              labels={labels}
              dataChart={dataAccess}
              title={t('access_title_chart')}
              borderColor='#DB5293'
              bgColor='#FDC5DE'
              step={accessStep}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
