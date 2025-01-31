/**
import api from './api';

// 定义 Post 类型
export interface Post {
  id: number;
  username: string;
  avatar: string; // 头像 URL
  content: string;
  image?: string; // 可选的图片/视频 URL
  createdAt: string;// 创建时间
}

// 从 Strapi 后端获取帖子列表
export const getPosts = async (): Promise<Post[]> => {
  try {
    const response = await api.get('/posts?populate=*'); // 使用 `populate=*` 获取关联字段

    // 假设你的 Strapi 后端有一个公共的域名用于处理媒体文件
    const baseUrl = 'http://localhost:1337'; // 请替换成你的 Strapi 域名
    const baseUrl = 'https://my-strapi-project-h7zt.onrender.com/'; // 请替换成你的 Strapi 域名

    return response.data.data.map((post: any) => ({
      id: post.id, // 帖子 ID
      username: post.username, // 用户名
      avatar: post.avatar?.url ? baseUrl + post.avatar.url : '/default-avatar.png', // 用户头像 URL，若无头像则使用默认头像
      content: post.content, // 帖子内容
      image: post.image?.[0]?.url ? baseUrl + post.image[0].url : '', // 帖子图片 URL，若无图片则为空
      createdAt: post.createdAt, // 发布时间
    }));
  } catch (error) {
    console.error('获取帖子失败:', error);
    return [];
  }
}; 
*/

import api from './api';

// 定义 Post 类型
export interface Post {
  id: number;
  username: string;
  avatar: string; // 头像 URL
  content: string;
  image?: string; // 可选的图片/视频 URL
  createdAt: string; // 创建时间
}

// 从 Strapi 后端获取帖子列表
export const getPosts = async (): Promise<Post[]> => {
  try {
    const response = await api.get('/posts?populate=*'); // 使用 `populate=*` 获取关联字段

    // 假设你的 Strapi 后端有一个公共的域名用于处理媒体文件
    const baseUrl = 'http://localhost:1337'; // 请替换成你的 Strapi 域名

    // 将帖子映射并按创建时间降序排列
    const posts = response.data.data.map((post: any) => ({
      id: post.id, // 帖子 ID
      username: post.username, // 用户名
      avatar: post.avatar?.url ? baseUrl + post.avatar.url : '/default-avatar.png', // 用户头像 URL，若无头像则使用默认头像
      content: post.content, // 帖子内容
      image: post.image?.[0]?.url ? baseUrl + post.image[0].url : '', // 帖子图片 URL，若无图片则为空
      createdAt: post.createdAt, // 发布时间
    }));

    // 按创建时间降序排列
    return posts.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
  } catch (error) {
    console.error('获取帖子失败:', error);
    return [];
  }
};

