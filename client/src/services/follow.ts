import { createFollow } from "../constants/type"
import { API } from "./list-api"
import request from "./request"

// Lấy gợi ý follow
export const followAPI = async (data: createFollow) => {
  return await request.post(API.FOLLOW, data)
}

// Bỏ follow
export const deleteFollowAPI = async ( friend_id: number,user_id: number) => {
  return await request.delete(`${API.FOLLOW}/${friend_id}/${user_id}`)
}

// Kiểm tra xem đã follow hay chưa
export const profileFollowAPI = async ( user_id: number, friend_id: number) => {
  return await request.get(`${API.CHECKFOLLOW}/${user_id}/${friend_id}`)
}
