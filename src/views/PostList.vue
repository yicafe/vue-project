<template>
  <div class="container p-4 mx-auto">
    <div class="grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-4">
      <div 
        v-for="post in posts" 
        :key="post.id"
        class="transition-all duration-300 bg-white shadow-md cursor-pointer rounded-xl hover:shadow-xl"
        @click.stop="expandPost(post.id)"
      >
        <!-- 卡片基础内容 -->
        <div class="relative">
          <!-- 头部区域 -->
          <div class="flex items-center gap-2 p-3">
            <img
              v-if="isavatar(post.avatar)"
              :src="post.avatar" 
              class="object-cover w-10 h-10 rounded-full"
              alt="用户头像"
            />
            <img
              v-else
              src="https://my-strapi-project-h7zt.onrender.com/uploads/IMG_3534_296353d343.jpeg"
              class="object-cover w-full h-full"
              alt="默认图片"
            />
            <div class="flex-1 min-w-0">
              <h3 class="text-sm font-medium truncate">{{ post.username }}</h3>
              <p class="text-xs text-gray-500 truncate">
                {{ formatDate(post.createdAt) }}
              </p>
            </div>
          </div>

          <!-- 内容区域 -->
          <p 
            class="px-3 mb-2 text-sm text-gray-700 line-clamp-2"
          >
            {{ post.content }}
          </p>

          <!-- 媒体容器 -->
          <div class="relative aspect-[3/2] overflow-hidden rounded-b-xl">
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
              src="https://my-strapi-project-h7zt.onrender.com/uploads/10_jannerugland_85da18286b.jpg"
              class="object-cover w-full h-full"
              alt="默认图片"
            />
          </div>
        </div>
      </div>
    </div>

    <!-- 全屏详情弹窗 -->
    <transition
      enter-active-class="transition-opacity duration-300"
      leave-active-class="transition-opacity duration-300"
      enter-from-class="opacity-0"
      enter-to-class="opacity-100"
      leave-from-class="opacity-100"
      leave-to-class="opacity-0"
    >
      <div 
        v-if="expandedPostId"
        class="fixed inset-0 z-50 flex items-start justify-center overflow-y-auto bg-black bg-opacity-50"
        @click.self="expandedPostId = null"
      >
        <div class="relative w-full max-w-2xl m-4 bg-white rounded-lg">
          <button 
            @click="expandedPostId = null"
            class="absolute p-2 text-gray-500 top-4 right-4 hover:text-gray-700"
          >
            <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"/>
            </svg>
          </button>
          <div class="p-6 space-y-4">
            <!-- 头部 -->
            <div class="flex items-center gap-3">
              <img 
                :src="selectedPost.avatar" 
                class="object-cover w-12 h-12 rounded-full"
                alt="用户头像"
              />
              <div>
                <h3 class="font-medium truncate">{{ selectedPost.username }}</h3>
                <p class="text-sm text-gray-500">
                  {{ formatFullDate(selectedPost.createdAt) }}
                </p>
              </div>
            </div>

            <!-- 内容 -->
            <p class="text-gray-700 whitespace-pre-line">{{ selectedPost.content }}</p>

            <!-- 媒体 -->
            <div class="relative aspect-[3/2] overflow-hidden rounded-xl">
              <template v-if="selectedPost.image">
                <img
                  v-if="isImage(selectedPost.image)"
                  :src="selectedPost.image"
                  class="object-cover w-full h-full"
                  alt="帖子图片"
                />
                <video
                  v-else
                  :src="selectedPost.image"
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

            <!-- 元数据 -->
            <div class="space-y-2 text-sm text-gray-500">
              <p v-if="selectedPost.location">📍 {{ selectedPost.location }}</p>
              <p>👁️‍🗨️ {{ selectedPost.views || 0 }} 次浏览</p>
            </div>

            <!-- 互动统计 -->
            <div class="flex items-center justify-between text-sm text-gray-600">
              <div class="flex space-x-4">
                <button class="flex items-center hover:text-blue-500">
                  <span class="mr-1">👍</span>
                  {{ selectedPost.likes || 0 }}
                </button>
                <button class="flex items-center hover:text-green-500">
                  <span class="mr-1">💬</span>
                  {{ selectedPost.comments || 0 }}
                </button>
              </div>
              <button class="hover:text-red-500">
                <span>🔖</span>
              </button>
            </div>

            <!-- 评论预览 -->
            <div class="pt-4 border-t border-gray-100">
              <div 
                v-for="comment in selectedPost.commentsPreview" 
                :key="comment.id"
                class="flex items-start py-3 space-x-3"
              >
                <img 
                  :src="comment.avatar" 
                  class="object-cover w-8 h-8 rounded-full"
                  alt="评论用户头像"
                />
                <div>
                  <p class="font-medium">{{ comment.user }}</p>
                  <p class="text-gray-600">{{ comment.text }}</p>
                  <p class="mt-1 text-xs text-gray-400">
                    {{ formatDate(comment.date) }}
                  </p>
                </div>
              </div>
              <button class="w-full pt-2 text-sm text-blue-500 hover:underline">
                查看全部{{ selectedPost.comments }}条评论
              </button>
            </div>
          </div>
        </div>
      </div>
    </transition>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue';
import { getPosts, Post } from '@/services/PostService';

const posts = ref<Post[]>([]);
const expandedPostId = ref<string | null>(null);

const selectedPost = computed(() => {
  return posts.value.find(post => post.id === expandedPostId.value) || {} as Post;
});

const expandPost = (postId: string) => {
  expandedPostId.value = postId;
};

// 保持原有的格式化和数据获取方法
// ...
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