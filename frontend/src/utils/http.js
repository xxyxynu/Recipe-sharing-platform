// axios基础的封装
import axios from 'axios'
//import { ElMessage } from 'element-plus'
import { useUserStore } from '../stores/userStore'
import router from '@/router'

const httpInstance = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://172.20.10.3:5001', // ✅ 确保和你的后端一致
  timeout: 5000,
  withCredentials: true // ✅ 允许携带 refreshToken Cookie
})

// 请求拦截器
httpInstance.interceptors.request.use(config => {
  const userStore = useUserStore()
  const token = userStore.userInfo?.token
  if (token) {
    config.headers.Authorization = `Bearer ${token}`
  }
  return config
}, e => Promise.reject(e))

// 响应拦截器
httpInstance.interceptors.response.use(
  res => res.data,
  async e => {
    const userStore = useUserStore()

    // 如果是401，尝试自动刷新token
    if (e.response?.status === 401 && !e.config._retry) {
      if (e.response?.status === 401) {
        userStore.logout()
        router.push('/login')
        return Promise.reject(e)
      }
    }

    // ElMessage({
    //   type: 'warning',
    //   message: e.response?.data?.message || 'Request failed'
    // })

    return Promise.reject(e)
  }
)

export default httpInstance
