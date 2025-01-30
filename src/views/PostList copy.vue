<template>
  <!-- 帖子容器 -->
  <div class="max-w-lg p-4 mx-auto bg-white rounded-lg shadow-lg">
    <!-- 遍历帖子 -->
    <div v-for="post in posts" :key="post.id" class="post">
      <!-- 帖子头部 -->
      <div class="post-header">
        <!-- 用户头像 -->
        <img :src="post.avatar" alt="User Avatar" class="avatar" />
        <!-- 用户信息 -->
        <div class="user-info">
          <h3>{{ post.username }}</h3>
          <p class="timestamp">{{ new Date(post.createdAt).toLocaleString() }}</p>
        </div>
        <div class="px-3 py-1 ml-auto">
          <DropdownsSimple />
        </div>
      </div>

      <!-- 帖子内容 -->
      <p class="content">{{ post.content }}</p>

      <!-- 图片或视频 -->
      <div v-if="post.image" class="post-image">
        <img
          v-if="isImage(post.image)"
          :src="post.image"
          alt="Post Image"
          class="w-full h-auto rounded-lg shadow-md"
        />
        <video
          v-else
          controls
          :src="post.image"
          class="w-full h-auto rounded-lg shadow-md"
        ></video>
      </div>

      <!-- 默认图片 -->
      <div v-else class="post-image">
        <img
          src="https://tailwindui.com/plus/img/ecommerce-images/home-page-03-hero-image-tile-07.jpg"
          alt="Default Post Image"
        />
      </div>

      <!-- 帖子底部 -->
      <div class="flex items-center justify-between mt-4 text-sm text-gray-500">
        <div class="flex items-center space-x-2">
          <button class="flex items-center space-x-1">
            <span>👍</span>
            <span>13.1万</span>
          </button>
          <button class="flex items-center space-x-1">
            <span>💬</span>
            <span>1.4万</span>
          </button>
          <button class="flex items-center space-x-1">
            <span>🔗</span>
            <span>5.3万</span>
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { getPosts, Post } from '@/services/PostService';
import DropdownsSimple from '../views/DropdownsSimple.vue';

// 定义响应式变量
const posts = ref<Post[]>([]);

// 组件加载后获取数据
onMounted(async () => {
  const data = await getPosts();
  console.log('Fetched posts:', data);
  posts.value = data;
});

// 判断文件是否为图片
const isImage = (file: string): boolean => {
  const imageExtensions = ['jpg', 'jpeg', 'png', 'gif', 'bmp', 'webp'];
  const extension = file.split('.').pop()?.toLowerCase();
  return extension ? imageExtensions.includes(extension) : false;
};
</script>

<style scoped>
/* 样式设置 */
.posts-container {
  display: flex;
  flex-direction: column;
  gap: 20px;
  align-items: center;
  height: 100vh;
}

.post {
  display: flex;
  flex-direction: column;
  border: 1px solid #ddd;
  padding: 20px;
  border-radius: 10px;
}

.post-header {
  display: flex;
  gap: 10px;
  margin-bottom: 10px;
}

.avatar {
  width: 40px;
  height: 40px;
  border-radius: 50%;
}

.user-info {
  display: flex;
  flex-direction: column;
  justify-content: center;
}

.timestamp {
  font-size: 0.8rem;
  color: #888;
}

.content {
  font-size: 1rem;
  margin-bottom: 10px;
}

.post-image img {
  width: 100%;
  max-height: 400px;
  object-fit: cover;
  margin-top: 10px;
}
</style>
