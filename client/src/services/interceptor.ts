import { LIST_API_NOT_AUTHENTICATE } from './list-api';
import type { AxiosInstance } from 'axios';
import { setLoading, setResStatus } from '../stores/slices/appSlice';
import { store } from '../stores/store';
import { localKey } from '../constants';

const notShowLoadingList = [
  '/message',
  'conversation',
  'user/find-user',
  '/comment',
  '/react-post',
  '/post/post-all',
  '/user/all-user',
  '/post/all-post',
  '/user/find-user/search',
  '/post/find-post/search',
  '/update/status',
  '/follow',
  '/noti',
  '/comment',
  '/react-cmt',
  '/post/profile',
  '/post/get-one',
];

const setupRequest = (instance: AxiosInstance) => {
  instance.interceptors.request.use(
    (config) => {
      let showLoading = false;
      if (config?.url) {
        showLoading = notShowLoadingList.some((url) =>
          config?.url?.includes(url)
        );
      }
      // hiển thị loading khi bắt đầu call API
      if (config?.url && !showLoading) {
        store.dispatch(setLoading(true));
      } else {
        store.dispatch(setLoading(false));
      }
      // set authen token
      if (
        config?.url ? !LIST_API_NOT_AUTHENTICATE.includes(config.url) : false
      ) {
        const token = localStorage.getItem(localKey.token);
        if (token) {
          config.headers.Authorization = `Bearer ${token}`;
        }
      }
      return config;
    },
    (err) => {
      return Promise.reject(err);
    }
  );
};

function setupResponse(instance: AxiosInstance) {
  instance.interceptors.response.use(
    (response) => {
      // tắt loading khi call API xong
      store.dispatch(setLoading(false));
      store.dispatch(setResStatus('success'));
      return response.data;
    },
    (error) => {
      Promise.reject(error);

      return setTimeout(() => {
        // hoặc khi xuất hiện lỗi
        store.dispatch(setLoading(false));
        store.dispatch(setResStatus('error'));
        return { data: { success: false, message: 'Error system' } };
      }, 500);
    }
  );
}

export { setupRequest, setupResponse };
