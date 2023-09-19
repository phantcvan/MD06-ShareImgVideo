import { createMediaType, createPostType } from '../constants/type';
import { API } from './list-api';
import request from './request';

// Lấy tất cả các bài POST
export const getPostAPI = async (start: number, user_id: number) => {
  return await request.get(`${API.POST}/${start}/${user_id}`);
};

// Lấy độ dài comment
export const getCommentLengthAPI = async (params: string) => {
  return await request.get(`${API.ALLPOST}/${params}`);
};

// Lấy thông tin 1 bài post theo postCode
export const getOnePostAPI = async (postCode: string) => {
  return await request.get(`${API.ALLPOST}/get-one/${postCode}`);
};

// Lấy tất cả các comment
export const getCommentAPI = async (params: string) => {
  return await request.get(`${API.COMMENT}/${params}`);
};

// Lấy tất cả các reaction
export const getReactionAPI = async (postCode: string) => {
  return await request.get(`${API.PROFILEREACT}/${postCode}`);
};

// Lấy gợi ý follow
export const getSuggestAPI = async (params: number) => {
  return await request.get(`${API.SUGGEST}/${params}`);
};

// Thêm bài post
export const createPostAPI = async (data: createPostType) => {
  return await request.post(API.CREATEPOST, data);
};

// Thêm media
export const createMediaAPI = async (data: createMediaType) => {
  return await request.post(API.CREATEMEDIA, data);
};
// Thêm bình luận
export const addCommentAPI = async (data: any) => {
  return await request.post(API.COMMENT, data);
};

// Xóa bài post
export const deletePostAPI = async (params: string) => {
  return await request.delete(`${API.CREATEPOST}/${params}`);
};

// Sửa bài post
export const editPostAPI = async (data: any) => {
  return await request.put(API.EDITPOST, data);
};

// Lấy tất cả bài post
export const postAllAPI = async () => {
  return await request.get(API.POSTALL);
};

// Lấy tất cả bài post
export const postOneAPI = async (params: number) => {
  return await request.get(`${API.POSTONE}/${params}`);
};
