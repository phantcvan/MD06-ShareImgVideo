import { createReactComment } from '../constants/type';
import { API } from './list-api';
import request from './request';

// Thả tim comment
export const reactCommentAPI = async (data: createReactComment) => {
  return await request.post(API.REACTCOMMENT, data);
};

//Bỏ Thả tim comment
export const deleteCommentAPI = async (cmt_id: number, user_id: number) => {
  return await request.delete(`${API.REACTCOMMENT}/${cmt_id}/${user_id}`);
};

//Lấy trạng thái thả tim comment
export const getReactCmtAPI = async (cmt_id: number) => {
  return await request.get(`${API.REACTCOMMENT}/${cmt_id}`);
};
