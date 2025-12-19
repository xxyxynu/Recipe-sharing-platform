import axios from 'axios';

const api = axios.create({
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
    if ((error.response?.status === 401 || error.response?.status === 403) && !originalRequest._retry) {
      if (originalRequest.url.includes('/users/login')) {
        return Promise.reject(error);
      }

      originalRequest._retry = true;

      try {

        const { data } = await api.get('/users/refresh-token');

        localStorage.setItem('accessToken', data.token);

        api.defaults.headers.common['Authorization'] = `Bearer ${data.token}`;
        originalRequest.headers['Authorization'] = `Bearer ${data.token}`;

        return api(originalRequest);
      } catch (refreshError) {
        console.error("Session expired", refreshError);
        localStorage.removeItem('accessToken');
        window.location.href = '/login';
        return Promise.reject(refreshError);
      }
    }
    return Promise.reject(error);
  }
);

export default api;