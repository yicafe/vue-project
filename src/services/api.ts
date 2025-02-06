import axios from 'axios';

//const API_URL = 'http://localhost:1337/api'; // 修改为你的 Strapi 地址
const API_URL = 'https://my-strapi-project-h7zt.onrender.com'; // 修改为你的 Strapi 地址

export const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// 注册
export const register = async (username, email, password) => {
  const response = await api.post('/auth/local/register', {
    username,
    email,
    password,
  });
  return response.data;
};

// 登录
export const login = async (identifier, password) => {
  const response = await api.post('/auth/local', {
    identifier,
    password,
  });
  return response.data;
};

// 登出
export const logout = () => {
  localStorage.removeItem('user');
};

// 获取当前用户
export const getUser = async (token) => {
  const response = await api.get('/users/me', {
    headers: { Authorization: `Bearer ${token}` },
  });
  return response.data;
};

// 发布内容 (假设有 "posts" 内容类型)
// 更新了发布内容的请求方式，符合 Strapi 5 的规范
export const createPost = async (token, title, content,username) => {
  try {
    const response = await api.post(
      '/posts', // 确保这个路径与你的 Strapi 内容类型路径匹配
      {
        data: { // 数据结构符合 Strapi 5 的格式
          title,
          content,
          username
        },
      },
      {
        headers: { Authorization: `Bearer ${token}` },
      }
    );
    return response.data;
  } catch (error) {
    console.error('发布内容失败', error.response ? error.response.data : error);
    throw error; // 抛出错误，供调用者处理
  }
};

export default api;
