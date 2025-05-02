import axios from 'axios';

//const API_URL = 'http://localhost:1337/api'; // 修改为你的 Strapi 地址
const API_URL = 'https://my-strapi-project-h7zt.onrender.com/api';

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

// 获取当前用户信息
export const getUser = async (token) => {
  const response = await api.get('/users/me', {
    headers: { Authorization: `Bearer ${token}` },
  });
  return response.data;
};

// 上传图片
export const uploadImage = async (token, file) => {
  const formData = new FormData();
  formData.append('files', file);

  try {
    const response = await axios.post(
      'https://my-strapi-project-h7zt.onrender.com/api/upload',
      formData,
      {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'multipart/form-data',
        },
      }
    );
    return response.data; // 上传成功后返回文件数组
  } catch (error) {
    console.error('上传图片失败', error.response?.data || error.message);
    throw error;
  }
};

// 创建帖子（支持图片）
export const createPost = async (token, avatar, title, content, username, image: any) => {
  try {
    const postData = {
      avatar,
      title,
      content,
      username,
    };

    if (image) {
      postData.image = image; // 关联图片 ID
    }
/**
    const response = await api.post(
      '/posts',
      { data: postData },
      { headers: { Authorization: `Bearer ${token}` } }
    );
 */
    const response = await api.post(
      '/posts', // 确保这个路径与你的 Strapi 内容类型路径匹配
      {
        data: { // 数据结构符合 Strapi 5 的格式
          avatar,
          title,
          content,
          username
        },
      },
      { headers: { Authorization: `Bearer ${token}` } }
    );

    return response.data;
  } catch (error) {
    console.error('发布内容失败', error.response?.data || error.message);
    throw error;
  }
};

export default api;
