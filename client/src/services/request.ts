import axios from 'axios'
import { setupRequest, setupResponse } from './interceptor'

const request = axios.create({
  baseURL: `${import.meta.env.VITE_APP_API_URL}/${import.meta.env.VITE_APP_API_VERSION}/`,
  headers: {
    'Content-Type': 'application/json'
  }
})

setupRequest(request)
setupResponse(request)

export default request