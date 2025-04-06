
import axios from 'axios';

//const API_URL = 'http://localhost:1337/api'; // 修改为你的 Strapi 地址
const API_URL = 'https://my-strapi-project-h7zt.onrender.com/api'; // 修改为你的 Strapi 地址

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

/*备份待开发
import axios from 'axios';

const API_URL = 'https://my-strapi-project-h7zt.onrender.com/api'; // 根据实际情况调整



export const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// 请求拦截器：自动添加 Token
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('jwt');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// 注册
export const register = async (username, email, password) => {
  try {
    const response = await api.post('/auth/local/register', {
      username,
      email,
      password,
    });
    // 存储用户信息和 token
    localStorage.setItem('jwt', response.data.jwt);
    localStorage.setItem('user', JSON.stringify(response.data.user));
    return response.data;
  } catch (error) {
    console.error('注册失败', error.response?.data || error.message);
    throw error;
  }
};

// 登录
export const login = async (identifier, password) => {
  try {
    const response = await api.post('/auth/local', {
      identifier,
      password,
    });
    // 存储用户信息和 token
    localStorage.setItem('jwt', response.data.jwt);
    localStorage.setItem('user', JSON.stringify(response.data.user));
    return response.data;
  } catch (error) {
    console.error('登录失败', error.response?.data || error.message);
    throw error;
  }
};

// 登出
export const logout = () => {
  localStorage.removeItem('jwt');
  localStorage.removeItem('user');
};

// 获取当前用户
export const getUser = async () => {
  try {
    const response = await api.get('/users/me');
    return response.data;
  } catch (error) {
    console.error('获取用户信息失败', error.response?.data || error.message);
    throw error;
  }
};

// 创建帖子
export const createPost = async (title, content) => {
  try {
    const user = JSON.parse(localStorage.getItem('user'));
    if (!user) throw new Error('用户未登录');

    const response = await api.post('/posts', {
      data: {
        title,
        content,
        user: user.id, // 关联用户 ID
      },
    });
    return response.data;
  } catch (error) {
    console.error('发布失败', error.response?.data || error.message);
    throw error;
  }
};

export default api;
*/