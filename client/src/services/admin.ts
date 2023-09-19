import { updateStatusType } from '../constants/type';
import { API } from './list-api';
import request from './request';

export const getUserQuantityAPI = async () => {
  return await request.get(`${API.USER}/all/by-month`);
};

export const getPostQuantityAPI = async () => {
  return await request.get(`${API.ALLPOST}/all/by-month`);
};

export const updateStatusAPI = async (data: updateStatusType) => {
  return await request.put(`${API.USER}/update/status`, data);
};

// get all User by Role
export const allUsersByRoleAPI = async (role: number, pageNum: number) => {
  return await request.get(`${API.USER}/all-user/${role}/${pageNum}`);
};
// get all post
export const allPostsAPI = async (pageNum: number) => {
  return await request.get(`${API.ALLPOST}/all-post/${pageNum}`);
};
// search Post
export const searchPostAPI = async (params: { q: string }, pageNum: number) => {
  return await request.get(`${API.ALLPOST}/find-post/search/${pageNum}`, {
    params,
  });
};
// Update show/hide post
export const updateStatusPostAPI = async (code: string) => {
  return await request.put(`${API.ALLPOST}/update/status/${code}`);
};