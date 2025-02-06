<template>
  <div v-if="currentUser">
    <h2>发布文章</h2>
    <p>当前登录用户: <strong>{{ currentUser.username }}</strong></p>
    <input v-model="title" placeholder="标题" />
    <textarea v-model="content" placeholder="内容"></textarea>
    <input v-model="currentUser.username" placeholder="#" disabled />
    <button @click="publishPost">发布</button>
  </div>
  <p v-else>请先登录</p>
</template>

<script>
import { ref, onMounted } from 'vue';
import { createPost } from '../services/api';

export default {
  setup() {
    const title = ref('');
    const content = ref('');
    const currentUser = ref(null);

    // 获取当前登录用户
    const getCurrentUser = () => {
      const users = JSON.parse(localStorage.getItem('users')) || [];
      currentUser.value = users.length > 0 ? users[users.length - 1] : null; // 取最后登录的用户
    };

    // 页面加载时获取用户信息
    onMounted(() => {
      getCurrentUser();

      // 监听用户登录/登出
      window.addEventListener('user-logged-in', getCurrentUser);
      window.addEventListener('user-logged-out', getCurrentUser);
    });

    const publishPost = async () => {
      if (!title.value || !content.value || !currentUser.value) {
        alert('请先登录后再发布文章');
        return;
      }
      try {
        await createPost(currentUser.value.token, title.value, content.value, currentUser.value.username);
        alert('文章发布成功');
      } catch (error) {
        console.error('发布失败', error);
      }
    };

    return { title, content, currentUser, publishPost };
  },
};
</script>
