
import { createReactPost } from '../constants/type';
import { API } from './list-api';
import request from './request';

//lấy profile
export const profileAPI = async (params: string) => {
  return await request.get(`${API.PROFILE}/${params}`);
};

//lấy profile
export const profileImageAPI = async (params: string) => {
  return await request.get(`${API.PROFILEPHOTO}/${params}`);
};

//lấy comment
export const profileCommentAPI = async (params: string) => {
  return await request.get(`${API.PROFILECOMMENT}/${params}`);
};

//lấy react
export const profileReactAPI = async (params: string) => {
  return await request.get(`${API.PROFILEREACT}/${params}`);
};

//lấy những người mình đang theo dõi
export const getFollowerAPI = async (params: string) => {
  return await request.get(`${API.FOLLOWER}/${params}`);
};

//lấy những người mình theo dõi
export const getFollowingAPI = async (params: string) => {
  return await request.get(`${API.FOLLOWING}/${params}`);
};

//Thả tim
export const reactAPI = async (data: createReactPost) => {
  return await request.post(API.PROFILEREACT,data);
};

//Bỏ tim
export const deleteReactAPI = async ( post_id: number,user_id: number) => {
  return await request.delete(`${API.PROFILEREACT}/${post_id}/${user_id}`);
};