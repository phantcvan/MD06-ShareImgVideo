import {
  postFollowType,
  postNotiType,
  updateAccessType,
  updatePassType,
  updateProfileType,
} from '../constants/type';
import { API } from './list-api';
import request from './request';

export const registerAPI = async (data: any) => {
  return await request.post(API.REGISTER, data);
};

export const SigninAPI = async (data: any) => {
  return await request.post(API.LOGIN, data);
};
export const searchAPI = async (params: { q: string }) => {
  return await request.get(API.SEARCH, { params });
};
// NOTIFICATION
//lấy về thông báo thuộc về user có id=params
export const notiAPI = async (params: string | number) => {
  return await request.get(`${API.NOTI}/${params}`);
};
//đếm số lượng thông báo thuộc về user có id=params
export const countNotiAPI = async (params: string | number) => {
  return await request.get(`${API.NOTI}/count/${params}`);
};
// tạo notification mới
export const createNotiAPI = async (data: postNotiType) => {
  return await request.post(API.NOTI, data);
};
// chuyển thông báo về "đã đọc"
export const updateStatusNotiAPI = async (params: string) => {
  return await request.patch(`${API.NOTI}/${params}`);
};
// Xoá thông báo khi người dùng unlike
export const deleteNotiAPI = async (data: postNotiType) => {
  return await request.delete(API.NOTI, {
    data,
  });
};

// FOLLOW
// Kiểm tra xem 2 người đã follow nhau chưa
export const checkFollowAPI = async (user_id: number, friend_id: number) => {
  return await request.get(`${API.FOLLOW}/check/${user_id}/${friend_id}`);
};
// follow bạn bè
export const createFollowAPI = async (data: postFollowType) => {
  return await request.post(API.FOLLOW, data);
};
// huỷ follow
export const deleteFollowAPI = async (user_id: number, friend_id: number) => {
  return await request.delete(`${API.FOLLOW}/${user_id}/${friend_id}`);
};
// update password
export const updatePasswordAPI = async (data: updatePassType) => {
  return await request.put(`${API.USER}/update/password`, data);
};
// update profile
export const updateProfileAPI = async (data: updateProfileType) => {
  return await request.put(`${API.USER}/update/info`, data);
};
// update access Log
export const updateAccessAPI = async (data: updateAccessType) => {
  return await request.post(API.ACCESS, data);
};
// get access Log
export const getAccessAPI = async () => {
  return await request.get(API.ACCESS);
};
