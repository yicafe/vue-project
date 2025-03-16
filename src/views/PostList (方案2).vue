<template>
  <div class="container p-4 mx-auto">
    <div class="grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-4">
      <div 
        v-for="post in posts" 
        :key="post.id"
        class="transition-all duration-300 bg-white shadow-md cursor-pointer rounded-xl hover:shadow-xl"
        :class="{ 'z-10': expandedPostId === post.id }"
        @click.stop="togglePost(post.id)"
      >
        <!-- 卡片基础内容 -->
        <div class="relative">
          <!-- 头部区域 -->
          <div class="flex items-center gap-2 p-3">
            <img 
              :src="post.avatar" 
              class="object-cover w-10 h-10 rounded-full"
              alt="用户头像"
            />
            <div class="flex-1 min-w-0">
              <h3 class="text-sm font-medium truncate">{{ post.username }}</h3>
              <p class="text-xs text-gray-500 truncate">
                {{ formatDate(post.createdAt) }}
              </p>
            </div>
            <button 
              v-if="expandedPostId === post.id"
              @click.stop="expandedPostId = null"
              class="p-1 text-gray-400 hover:text-gray-600"
            >
              <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"/>
              </svg>
            </button>
          </div>

          <!-- 内容区域 -->
          <p 
            class="px-3 mb-2 text-sm text-gray-700 line-clamp-2"
          >
            {{ post.content }}
          </p>

          <!-- 媒体容器 -->
          <div class="relative aspect-[3/2] overflow-hidden rounded-b-xl">
            <!-- 原有媒体显示代码 -->
            <template v-if="post.image">
              <img
                v-if="isImage(post.image)"
                :src="post.image"
                class="object-cover w-full h-full transition-transform duration-300 hover:scale-105"
                loading="lazy"
                alt="帖子内容"
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
              src="https://my-strapi-project-h7zt.onrender.com/uploads/thumbnail_4_snow_shower.jpg"
              class="object-cover w-full h-full"
              alt="默认图片"
            />
          </div>

          <!-- 展开内容（绝对定位） -->
          <transition
            enter-active-class="transition-all duration-300 ease-out"
            leave-active-class="transition-all duration-200 ease-in"
            enter-from-class="-translate-y-2 opacity-0"
            enter-to-class="translate-y-0 opacity-100"
            leave-from-class="translate-y-0 opacity-100"
            leave-to-class="-translate-y-2 opacity-0"
          >
            <div 
              v-show="expandedPostId === post.id" 
              class="absolute left-0 right-0 mt-2 bg-white rounded-lg shadow-xl"
              style="top: calc(100% + 8px)"
            >
              <div class="p-3 space-y-3">
                <!-- 原有展开内容 -->
                <!-- 元数据 -->
                <div class="space-y-1 text-xs text-gray-500">
                  <p>发布于 {{ formatFullDate(post.createdAt) }}</p>
                  <p v-if="post.location">📍 {{ post.location }}</p>
                  <p>👁️‍🗨️ {{ post.views || 0 }} 次浏览</p>
                </div>

                <!-- 互动统计 -->
                <div class="flex justify-between text-xs text-gray-600">
                  <!-- 原有互动代码 -->
                  <div class="flex space-x-3">
                  <button class="flex items-center hover:text-blue-500">
                    <span class="w-4 h-4 mr-1 i-heroicons-hand-thumb-up-20-solid"/>
                    {{ post.likes || 0 }}
                  </button>
                  <button class="flex items-center hover:text-green-500">
                    <span class="w-4 h-4 mr-1 i-heroicons-chat-bubble-oval-left-20-solid"/>
                    {{ post.comments || 0 }}
                  </button>
                </div>
                <button class="hover:text-red-500">
                  <span class="w-4 h-4 i-heroicons-bookmark-20-solid"/>
                </button>
                </div>

                <!-- 评论预览 -->
                <div class="pt-3 border-t border-gray-100">
                  <!-- 原有评论代码 -->
                  <div 
                  v-for="comment in post.commentsPreview" 
                  :key="comment.id"
                  class="flex items-start py-2 space-x-2 text-sm"
                >
                  <img 
                    :src="comment.avatar" 
                    class="w-6 h-6 mt-1 rounded-full"
                  />
                  <div>
                    <p class="font-medium">{{ comment.user }}</p>
                    <p class="text-gray-600">{{ comment.text }}</p>
                    <p class="mt-1 text-xs text-gray-400">
                      {{ formatDate(comment.date) }}
                    </p>
                  </div>
                </div>
                <button class="w-full pt-2 text-xs text-blue-500 hover:underline">
                  查看全部{{ post.comments }}条评论
                </button>
                </div>
              </div>
            </div>
          </transition>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
// 原有脚本代码保持不变...
import { ref, onMounted } from 'vue';
import { getPosts, Post } from '@/services/PostService';

interface Comment {
  id: string;
  user: string;
  text: string;
  avatar: string;
  date: string;
}
/*
interface Post {
  id: string;
  username: string;
  avatar: string;
  content: string;
  createdAt: string;
  media?: string;
  likes?: number;
  comments?: number;
  views?: number;
  location?: string;
  commentsPreview?: Comment[];
}
  */

const posts = ref<Post[]>([]);
const expandedPostId = ref<string | null>(null);

// 切换展开状态
const togglePost = (postId: string) => {
  expandedPostId.value = expandedPostId.value === postId ? null : postId;
};
/*
// 图片检测
const isImage = (file: string) => {
  return /\.(jpe?g|png|gif|webp|bmp)(\?.*)?$/i.test(file);
};
*/

// 判断文件是否为图片
const isImage = (file: string): boolean => {
  const imageExtensions = ['jpg', 'jpeg', 'png', 'gif', 'bmp', 'webp'];
  const extension = file.split('.').pop()?.toLowerCase();
  return extension ? imageExtensions.includes(extension) : false;
};

// 日期格式化
const formatDate = (dateString: string) => {
  return new Date(dateString).toLocaleDateString('zh-CN', {
    month: 'short',
    day: 'numeric'
  });
};

const formatFullDate = (dateString: string) => {
  return new Date(dateString).toLocaleString('zh-CN', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  });
};
/*
// 模拟数据初始化
onMounted(() => {
  posts.value = Array.from({ length: 8 }, (_, i) => ({
    id: `post-${i}`,
    username: `用户${i + 1}`,
    avatar: `https://randomuser.me/api/portraits/${i % 2 ? 'men' : 'women'}/${i}.jpg`,
    content: `这是一条示例帖子内容 ${i + 1}，包含足够长的文本用于测试文字截断和展开功能。可以继续添加更多内容以测试多行显示效果。`,
    createdAt: new Date(Date.now() - i * 3600000).toISOString(),
    media: i % 4 ? `https://source.unsplash.com/random/800x600?${i}` : undefined,
    likes: Math.floor(Math.random() * 1000),
    comments: Math.floor(Math.random() * 500),
    views: Math.floor(Math.random() * 5000),
    location: i % 2 ? '上海' : '北京',
    commentsPreview: Array.from({ length: 2 }, (_, j) => ({
      id: `comment-${i}-${j}`,
      user: `用户${j + 1}`,
      text: `这是第${j + 1}条示例评论`,
      avatar: `https://randomuser.me/api/portraits/${j % 2 ? 'men' : 'women'}/${j + 5}.jpg`,
      date: new Date(Date.now() - j * 600000).toISOString()
    }))
  }));
});
*/
// 组件加载后获取数据
onMounted(async () => {
  const data = await getPosts();
  console.log('Fetched posts:', data);
  posts.value = data;
});

</script>

<style>
/* 添加点击外部关闭功能 */
.click-outside-listener {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  z-index: 9;
}
</style>