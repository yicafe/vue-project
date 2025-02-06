/**
// services/api.ts
import axios from 'axios';

const api = axios.create({
  //baseURL: 'http://localhost:1337/api', // 替换为你的 Strapi 后端地址
  baseURL: 'https://my-strapi-project-h7zt.onrender.com/api', // 替换为你的 Strapi 后端地址
  timeout: 5000, // 请求超时设置
  headers: {
    'Content-Type': 'application/json',
  },
});

export default api;
*/

import axios from "axios";

const API_URL = "http://localhost:1337/api"; // 你的 Strapi 地址

const api = axios.create({
  baseURL: API_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

// 获取 token 并在请求时自动添加
api.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export default api;
