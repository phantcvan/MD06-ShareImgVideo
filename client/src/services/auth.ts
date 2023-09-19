import { LoginType } from '../constants/type';
import { API } from './list-api';
import request from './request';

export const loginAPI = async (data: LoginType) => {
  return await request.post(API.LOGIN, data)
}

export const authAPI = async () => {
  return await request.get(API.AUTH)
}

