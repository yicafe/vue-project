<template>
  <div v-if="currentUser">
    <!-- 当前登录用户 
    <p>你好: <strong>{{ currentUser.username }}</strong></p>
    -->
    <p>你好：</p><input v-model="currentUser.username" placeholder="#" disabled /><br>
    <input v-model="title" placeholder="标题" /><br><hr>
    <textarea v-model="content" placeholder="内容"></textarea><br>

    <button class="inline-block px-6 py-0 font-medium text-center text-black border border-transparent rounded-md bg-violet-300 hover:bg-violet-400" @click="publishPost">发布</button>
    <br>
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
