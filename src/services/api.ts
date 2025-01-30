// services/api.ts
import axios from 'axios';

const api = axios.create({
  baseURL: 'http://localhost:1337/api', // 替换为你的 Strapi 后端地址
  timeout: 5000, // 请求超时设置
  headers: {
    'Content-Type': 'application/json',
  },
});

export default api;
