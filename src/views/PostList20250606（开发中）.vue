<template>
  <!-- 外层容器 -->
  <div class="container p-4 mx-auto">
    <!-- 响应式网格布局 -->
    <div class="grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-4">
      <!-- 帖子卡片循环 -->
      <div v-for="post in posts" :key="post.id"
        class="transition-all duration-300 bg-white shadow-md cursor-pointer rounded-xl hover:shadow-xl"
        @click.stop="expandPost(post.id)">
        <!-- 卡片基础内容 -->
        <div class="relative">
          <!-- 头部区域 -->
          <div class="flex items-center gap-2 p-3">
            <img :src="post.avatar || defaultAvatar" class="object-cover w-10 h-10 rounded-full" alt="用户头像" />
            <div class="flex-1 min-w-0">
              <h3 class="text-sm font-medium truncate">{{ post.username }}</h3>
              <p class="text-xs text-gray-500 truncate">
                {{ formatDate(post.createdAt) }}
              </p>
            </div>
          </div>

          <!-- 内容区域 -->
          <p class="px-3 mb-2 text-sm text-gray-700 line-clamp-2">
            {{ post.content }}
          </p>

          <!-- 媒体容器 -->
          <div class="relative aspect-[3/2] overflow-hidden rounded-b-xl">
            <template v-if="post.image">
              <img v-if="isImage(post.image)" :src="post.image"
                class="object-cover w-full h-full transition-transform duration-300 hover:scale-105" loading="lazy"
                alt="帖子内容" />
              <video v-else :src="post.image" class="object-cover w-full h-full" controls></video>
            </template>
            <img v-else src="https://my-strapi-project-h7zt.onrender.com/uploads/DSC_01697_d5da3a432e_5d925b2ba1.JPG"
              class="object-cover w-full h-full" alt="默认图片" />
          </div>
        </div>
      </div>
    </div>

    <!-- 全屏详情弹窗 -->
    <transition enter-active-class="transition-opacity duration-300"
      leave-active-class="transition-opacity duration-300" enter-from-class="opacity-0" enter-to-class="opacity-100"
      leave-from-class="opacity-100" leave-to-class="opacity-0">
      <div v-if="expandedPostId"
        class="fixed inset-0 z-50 flex items-start justify-center overflow-y-auto bg-black bg-opacity-50"
        @click.self="expandedPostId = null" @touchstart.passive="handleTouchStart" @touchmove.passive="handleTouchMove"
        @touchend="handleTouchEnd" @mousedown="handleMouseStart" @mousemove="handleMouseMove" @mouseup="handleMouseEnd"
        @mouseleave="handleMouseEnd" @keydown="handleKeyDown" tabindex="-1">
        <div class="relative w-full max-w-2xl m-4 transition-transform duration-300 bg-white rounded-lg"
          :style="swipeStyle">
          <!-- 关闭按钮 -->
          <button @click="expandedPostId = null"
            class="absolute p-2 text-gray-500 bottom-4 right-4 hover:text-gray-700">
            <!-- SVG关闭图标 -->
            <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
          <!-- 弹窗内容区域 -->
          <div class="p-6 space-y-4">
            <!-- 头部 -->
            <div class="flex items-center gap-3">
              <img :src="selectedPost.avatar || defaultAvatar" class="object-cover w-12 h-12 rounded-full" alt="用户头像" />
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
                <img v-if="isImage(selectedPost.image)" :src="selectedPost.image" class="object-cover w-full h-full"
                  alt="帖子图片" />
                <video v-else :src="selectedPost.image" class="object-cover w-full h-full" controls></video>
              </template>
              <img v-else src="https://my-strapi-project-h7zt.onrender.com/uploads/DSC_01697_d5da3a432e_5d925b2ba1.JPG"
                class="object-cover w-full h-full" alt="默认图片" />
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
              <div v-for="comment in selectedPost.commentsPreview" :key="comment.id"
                class="flex items-start py-3 space-x-3">
                <img :src="comment.avatar || defaultAvatar" class="object-cover w-8 h-8 rounded-full" alt="评论用户头像" />
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
    <!-- 键盘操作提示 -->
    <div v-if="expandedPostId"
      class="fixed flex items-center gap-4 px-4 py-2 text-sm text-white transform -translate-x-1/2 bg-black rounded-lg bottom-4 left-1/2 bg-opacity-70 backdrop-blur-sm">
      <span>使用 ← → 滑动切换</span>
      <kbd class="px-2 py-1 text-xs bg-gray-700 border border-gray-600 rounded-md">←</kbd>
      <kbd class="px-2 py-1 text-xs bg-gray-700 border border-gray-600 rounded-md">→</kbd>
      <span class="ml-4">按</span>
      <kbd class="px-2 py-1 text-xs bg-gray-700 border border-gray-600 rounded-md">ESC</kbd>
      <span>关闭</span>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, watch, nextTick } from 'vue';
import { getPosts, Post } from '@/services/PostService';

// 响应式数据
const posts = ref<Post[]>([]);
const expandedPostId = ref<string | null>(null);
const defaultAvatar = 'https://my-strapi-project-h7zt.onrender.com/uploads/IMG_3534_296353d343_123d519614.jpeg';//添加默认头像常量

// 滑动相关状态
const touchStartX = ref(0);
const touchStartTime = ref(0);
const currentOffsetX = ref(0);
const isSwiping = ref(false);
let mouseStartX = 0;
let isMouseDown = false;
let isSwitching = false;

// 滑动参数配置
const SWIPE_THRESHOLD = 50;    // 触发切换的最小滑动距离
const SWIPE_SPEED_THRESHOLD = 0.3; // 触发切换的最小滑动速度(px/ms)
const MAX_SWIPE_OFFSET = 100;  // 最大滑动距离

//计算属性(计算当前选中的帖子)
const selectedPost = computed(() =>
  posts.value.find(post => post.id === expandedPostId.value) || {} as Post
);

const currentIndex = computed(() =>
  posts.value.findIndex(post => post.id === expandedPostId.value)
);

const swipeStyle = computed(() => ({
  transform: `translateX(${currentOffsetX.value}px)`,
  opacity: 1 - Math.abs(currentOffsetX.value) / 200
}));

// 触摸事件处理
const handleTouchStart = (e: TouchEvent) => {
  touchStartX.value = e.touches[0].clientX;
  touchStartTime.value = Date.now();
  currentOffsetX.value = 0;
  isSwiping.value = true;
};

const handleTouchMove = (e: TouchEvent) => {
  if (!isSwiping.value) return;

  const deltaX = e.touches[0].clientX - touchStartX.value;
  currentOffsetX.value = Math.abs(deltaX) > MAX_SWIPE_OFFSET
    ? MAX_SWIPE_OFFSET * Math.sign(deltaX)
    : deltaX;
};

const handleTouchEnd = () => {
  isSwiping.value = false;
  const deltaTime = Date.now() - touchStartTime.value;
  const swipeSpeed = Math.abs(currentOffsetX.value) / deltaTime;

  if (Math.abs(currentOffsetX.value) > SWIPE_THRESHOLD || swipeSpeed > SWIPE_SPEED_THRESHOLD) {
    switchPost(currentOffsetX.value > 0 ? 'prev' : 'next');
  }
  currentOffsetX.value = 0;
};

// 鼠标事件处理
const handleMouseStart = (e: MouseEvent) => {
  mouseStartX = e.clientX;
  isMouseDown = true;
  touchStartTime.value = Date.now();
};

const handleMouseMove = (e: MouseEvent) => {
  if (!isMouseDown) return;

  const deltaX = e.clientX - mouseStartX;
  currentOffsetX.value = Math.abs(deltaX) > MAX_SWIPE_OFFSET
    ? MAX_SWIPE_OFFSET * Math.sign(deltaX)
    : deltaX;
};

const handleMouseEnd = () => {
  if (!isMouseDown) return;
  isMouseDown = false;

  const deltaTime = Date.now() - touchStartTime.value;
  const swipeSpeed = Math.abs(currentOffsetX.value) / deltaTime;

  if (Math.abs(currentOffsetX.value) > SWIPE_THRESHOLD || swipeSpeed > SWIPE_SPEED_THRESHOLD) {
    switchPost(currentOffsetX.value > 0 ? 'prev' : 'next');
  }
  currentOffsetX.value = 0;
};

// 键盘事件处理
const handleKeyDown = (e: KeyboardEvent) => {
  e.preventDefault();
  const target = e.target as HTMLElement;
  if (target.tagName === 'INPUT' || target.tagName === 'TEXTAREA') return;

  switch (e.key) {
    case 'ArrowLeft':
      switchPost('prev');
      break;
    case 'ArrowRight':
      switchPost('next');
      break;
    case 'Escape':
      expandedPostId.value = null;
      break;
  }
};

// 自动聚焦处理
watch(expandedPostId, (newVal) => {
  nextTick(() => {
    const overlay = document.querySelector('.overlay-container');
    if (newVal && overlay) {
      (overlay as HTMLElement).focus();
    }
  });
});

// 帖子切换逻辑
const switchPost = async (direction: 'prev' | 'next') => {
  if (isSwitching) return;
  isSwitching = true;

  let newIndex = currentIndex.value;
  direction === 'next' ? newIndex++ : newIndex--;

  // 循环切换逻辑
  if (newIndex >= posts.value.length) newIndex = 0;
  if (newIndex < 0) newIndex = posts.value.length - 1;

  // 切换动画
  currentOffsetX.value = direction === 'next' ? 100 : -100;
  await nextTick();

  expandedPostId.value = posts.value[newIndex]?.id || null;
  currentOffsetX.value = 0;

  isSwitching = false;
};

// 展开帖子方法
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

// 完整日期格式化
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
/* 滑动动画 */
.swipe-transition {
  transition: transform 0.3s cubic-bezier(0.25, 0.46, 0.45, 0.94),
    opacity 0.3s ease;
}

/* 阻止图片拖拽 */
img {
  user-drag: none;
  -webkit-user-drag: none;
}

/* 入场出场动画 */
.swipe-enter-active,
.swipe-leave-active {
  transition: transform 0.3s ease, opacity 0.3s ease;
}

.swipe-enter-from {
  transform: translateX(100%);
  opacity: 0;
}

.swipe-leave-to {
  transform: translateX(-100%);
  opacity: 0;
}
</style>