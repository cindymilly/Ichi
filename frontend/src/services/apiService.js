import axios from 'axios';

// Kết nối tới backend Express đang chạy ở port 5000
const api = axios.create({
  baseURL: process.env.REACT_APP_API_URL || 'http://localhost:5000/api',
  headers: {
    'Content-Type': 'application/json'
  }
});

// Tự động chèn Token vào mỗi request nếu đã đăng nhập
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('ichi_token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
}, (error) => {
  return Promise.reject(error);
});

export default api;
