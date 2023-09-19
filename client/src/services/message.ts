import { createMessType } from '../constants/type';
import { API } from './list-api';
import request from './request';

// tạo cuộc hội thoại mới
export const createGroupAPI = async (data: any) => {
  return await request.post(API.CONVERSATION, data);
};
// lấy về các cuộc hội thoại thuộc về user có id=params
export const getAllGroupAPI = async (params: string) => {
  return await request.get(`${API.CONVERSATION}/all/${params}`);
};
// lấy về các user trong cuộc hội thoại thuộc về group có converCode=params
export const getAllMemberAPI = async (params: string) => {
  return await request.get(`${API.CONVERSATION}/group/${params}`);
};
// gửi message
export const createMessAPI = async (data: createMessType) => {
  return await request.post(`${API.MESSAGE}/send`, data);
};
// lấy về các message thuộc về group có converCode=params
export const getAllMessAPI = async (converCode: string, userId:number) => {
  return await request.get(`${API.MESSAGE}/group/${converCode}/${userId}`);
};
// lấy về message cuối cùng thuộc về group có converCode, kiểm tra xem user có id=userId đã xoá group chưa
export const getLastMessAPI = async (converCode: string, userId:number) => {
  return await request.get(`${API.MESSAGE}/last/${converCode}/${userId}`);
};
// xoá đoạn chat
export const deleteMessAPI = async (converCode: string, userId:number) => {
  return await request.patch(`${API.MESSAGE}/${converCode}/${userId}`);
};
