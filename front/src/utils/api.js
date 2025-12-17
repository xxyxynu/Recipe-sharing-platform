import axios from 'axios';

// 创建 axios 实例
const api = axios.create({
  // 如果 VITE_API_URL 存在（线上），就用线上的；否则用本地的
  baseURL: 'https://recipe-backend-api-e6if.onrender.com',
  withCredentials: true, // 允许携带 cookie
  headers: {
    'Content-Type': 'application/json'
  }
});


// 请求拦截器：自动给请求头加上 Access Token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('accessToken');
    if (token) {
      config.headers['Authorization'] = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// 响应拦截器：处理 Token 过期 (403/401)
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    // 如果后端返回 403 (Invalid refresh token 或 Access Token 过期) 并且还没重试过
    // 注意：你的后端中间件如果 AccessToken 过期通常返回 401，这里最好 401 和 403 都防一下
    if ((error.response?.status === 401 || error.response?.status === 403) && !originalRequest._retry) {

      // 如果是登录请求本身失败，就不要重试了，直接抛出
      if (originalRequest.url.includes('/users/login')) {
        return Promise.reject(error);
      }

      originalRequest._retry = true;

      try {
        // 调用刷新 Token 接口
        // 注意：Refresh Token 存在 HttpOnly Cookie 中，浏览器会自动带上
        const { data } = await api.get('/users/refresh-token');

        // 拿到新的 Access Token
        localStorage.setItem('accessToken', data.token);

        // 更新 header 并重试原请求
        api.defaults.headers.common['Authorization'] = `Bearer ${data.token}`;
        originalRequest.headers['Authorization'] = `Bearer ${data.token}`;

        return api(originalRequest);
      } catch (refreshError) {
        // 刷新失败 (比如 Refresh Token 也过期了)，清除本地数据并跳转登录
        console.error("Session expired", refreshError);
        localStorage.removeItem('accessToken');
        window.location.href = '/login'; // 强制跳转
        return Promise.reject(refreshError);
      }
    }
    return Promise.reject(error);
  }
);

export default api;