import { notification } from 'antd';

export const notiError = ( message:string) => {
  notification.error({
    message: message,
    placement: 'top',
    duration: 2,
  });
};
export const notiSuccess = ( message:string) => {
  notification.success({
    message: message,
    placement: 'top',
    duration: 2,
  });
};
