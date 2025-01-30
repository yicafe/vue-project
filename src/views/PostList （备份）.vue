<template>
  <!-- Posts Container: 用于展示所有的帖子 -->
  <div class="max-w-lg p-4 mx-auto bg-white rounded-lg shadow-lg ">
    <!-- 循环渲染每个帖子 -->
    <div v-for="post in posts" :key="post.id" class="post">
      
      <!-- 帖子头部（显示用户头像和信息） -->
      <div class="post-header">
        <!-- 用户头像，绑定头像的 URL -->
        <img :src="post.avatar" alt="User Avatar" class="avatar" />
        
        <!-- 用户信息区域（包括用户名和发布时间） -->
        <div class="user-info">
          <h3>{{ post.username }}</h3>
          <!-- 显示发布时间，格式化日期为本地时间字符串 -->
          <p class="timestamp">{{ new Date(post.createdAt).toLocaleString() }}</p>
        </div>
        <div class="px-3 py-1 ml-auto ">    <!-- class="px-3 py-1 ml-auto text-sm text-pink-500 border border-red-500 rounded-full" -->
          <DropdownsSimple></DropdownsSimple><!-- 关注 -->
        </div>
      </div>
      
      <!-- 发布的文字内容 -->
      <p class="content">{{ post.content }}</p>
      
      <!-- 如果帖子有图片，显示图片 -->
      <div v-if="post.image" class="post-image">
        <img :src="post.image" alt="Post Image" />
        <video controls :src="post.image" class="w-full h-auto rounded-lg shadow-md"></video>
      </div>

      <!-- 如果没有图片，可以显示一个默认图片或不显示图片部分 -->
      <div v-else class="post-image">
        <img src="https://tailwindui.com/plus/img/ecommerce-images/home-page-03-hero-image-tile-07.jpg" alt="Default Post Image" />
      </div>
      <hr />
      <!-- Footer -->
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
import { getPosts } from '@/services/PostService';  // 导入服务层的 getPosts 方法，来获取数据
import DropdownsSimple from '../views/DropdownsSimple.vue'// 导入下拉列表

// 定义 Post 类型，以便 TypeScript 能够提供类型检查和代码提示
interface Post {
  id: number;
  avatar: { url: string };  // 用户头像 URL
  username: string;  // 用户名
  content: string;  // 帖子的文字内容
  image?: { url: string };  // 确保 image 是可选的，且可能包含 URL
  createdAt: string;  // 发布时间
}

// 用 ref 创建一个响应式变量 posts 来存储帖子数据
const posts = ref<Post[]>([]);

// 使用 onMounted 钩子来在组件加载后获取数据
onMounted(async () => {
  const data = await getPosts();  // 从服务层获取数据
  console.log('Fetched posts:', data);  // 调试输出数据
  posts.value = data;  // 将获取的数据赋值给 posts
});


</script>

<style scoped>
/* 定义样式，确保样式只作用于当前组件 */
.posts-container {
  display: flex;
  flex-direction: column;  /* 垂直排列所有帖子 */
  gap: 20px;  /* 帖子之间有间距 */
  align-items: center;  /* 水平方向居中 */
  height: 100vh;  /* 确保容器的高度为视口高度 */
}


/* 每个帖子的样式 */
.post {
  display: flex;
  flex-direction: column;  /* 垂直排列帖子内容 */
  border: 1px solid #ddd;  /* 边框 */
  padding: 20px;  /* 内边距 */
  border-radius: 10px;  /* 圆角 */
}

/* 帖子头部（包括头像和用户信息） */
.post-header {
  display: flex;
  gap: 10px;  /* 头像和用户信息之间有间距 */
  margin-bottom: 10px;  /* 帖子头部和文字内容之间有间距 */
}

/* 头像样式 */
.avatar {
  width: 40px;
  height: 40px;
  border-radius: 50%;  /* 圆形头像 */
}

/* 用户信息部分的样式 */
.user-info {
  display: flex;
  flex-direction: column;
  justify-content: center;  /* 垂直居中 */
}

/* 时间戳样式，显示发布时间 */
.timestamp {
  font-size: 0.8rem;  /* 小字号 */
  color: #888;  /* 灰色 */
}

/* 帖子的文字内容样式 */
.content {
  font-size: 1rem;  /* 正文字号 */
  margin-bottom: 10px;  /* 文字和图片之间有间距 */
}

/* 发布的图片样式 */
.post-image img {
  width: 100%;  /* 图片宽度为父容器的 100% */
  max-height: 400px;  /* 限制最大高度 */
  object-fit: cover;  /* 保持比例裁剪 */
  margin-top: 10px;  /* 图片和文字之间有间距 */
  
  
}



</style>
