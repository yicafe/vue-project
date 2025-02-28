<template>
  <!-- 帖子容器改为网格布局 -->
  <div class="container p-4 mx-auto">
    <div class="grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-4">
      <!-- 单个帖子卡片 -->
      <div 
        v-for="post in posts" 
        :key="post.id"
        class="transition-all duration-300 bg-white shadow-md rounded-xl hover:shadow-xl"
      >
        <!-- 帖子头部 -->
        <div class="flex items-center gap-2 p-3">
          <img 
            :src="post.avatar" 
            class="object-cover w-10 h-10 rounded-full"
            alt="User Avatar"
          />
          <div class="flex-1 min-w-0">
            <h3 class="text-sm font-medium truncate">{{ post.username }}</h3>
            <p class="text-xs text-gray-500 truncate">
              {{ formatDate(post.createdAt) }}
            </p>
          </div>
          <!-- 下拉菜单（待完善） -->
          <!-- <DropdownsSimple class="ml-auto" /> -->
        </div>

        <!-- 内容区域 -->
        <p class="px-3 mb-2 text-sm text-gray-700 line-clamp-2">{{ post.content }}</p>

        <!-- 媒体容器 -->
        <div class="relative aspect-[3/2] overflow-hidden rounded-b-xl">
          <template v-if="post.image">
            <img
              v-if="isImage(post.image)"
              :src="post.image"
              class="object-cover w-full h-full transition-transform duration-300 hover:scale-105"
              loading="lazy"
              alt="Post media"
            />
            <video
              v-else
              :src="post.image"
              class="object-cover w-full h-full"
              controls
            ></video>
          </template>
          <img
            v-else
            src="https://my-strapi-project-h7zt.onrender.com/uploads/thumbnail_4_snow_shower_5f90d5c8de.jpg"
            class="object-cover w-full h-full"
            alt="Default media"
          />
        </div>

        <!-- 底部互动栏（待完善） -->
        <!-- <div class="flex items-center justify-between p-3 text-sm text-gray-500">
          <div class="flex space-x-3">
            <button class="flex items-center space-x-1">
              <span class="w-4 h-4 i-heroicons-hand-thumb-up-20-solid"></span>
              <span>13.1万</span>
            </button>
            <button class="flex items-center space-x-1">
              <span class="w-4 h-4 i-heroicons-chat-bubble-oval-left-20-solid"></span>
              <span>1.4万</span>
            </button>
          </div>
          <button>
            <span class="w-4 h-4 i-heroicons-share-20-solid"></span>
          </button>
        </div> -->
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { getPosts, Post } from '@/services/PostService';
// import DropdownsSimple from '../views/DropdownsSimple.vue';

const posts = ref<Post[]>([]);

// 格式化日期
const formatDate = (dateString: string) => {
  return new Date(dateString).toLocaleDateString('zh-CN', {
    month: 'short',
    day: 'numeric'
  });
};

// 图片类型检测
const isImage = (file: string): boolean => {
  return /\.(jpg|jpeg|png|gif|webp)(\?.*)?$/i.test(file);
};

onMounted(async () => {
  const data = await getPosts();
  posts.value = data;
});
</script>