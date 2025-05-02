<template>
  <div v-if="currentUser" class="p-6 bg-white rounded-lg shadow-md">
    <p>你好：</p>
    <input v-model="currentUser.username" placeholder="#" disabled /><br />

    <input v-model="title" placeholder="标题" class="w-full p-2 my-2 border" /><br />

    <textarea v-model="content" placeholder="内容" class="w-full p-2 my-2 border"></textarea><br />

    <!-- 图片上传 -->
    <input type="file" @change="handleImageUpload" class="my-2" /><br />

    <button
      class="inline-block px-6 py-2 font-medium text-center text-black border border-transparent rounded-md bg-violet-300 hover:bg-violet-400"
      @click="publishPost"
    >
      发布
    </button>
  </div>

  <div v-else class="p-6 bg-white rounded-lg shadow-md">
    <ul>
      <li>
        <a href="https://cliooz.cn/#/shequgongyue" class="block p-0 rounded bg-violet-300 hover:bg-gray-400">
          社区公约
        </a>
      </li>
      <p>请遵守法律，社区公约，本平台不可填写任何个人隐私信息</p>
    </ul>
  </div>
</template>

<script>
import { ref, onMounted } from 'vue';
import { createPost, uploadImage } from '../services/api';

export default {
  setup() {
    const avatar = ref('');
    const title = ref('');
    const content = ref('');
    const imageFile = ref(null);
    const currentUser = ref(null);

    const getCurrentUser = () => {
      const users = JSON.parse(localStorage.getItem('users')) || [];
      currentUser.value = users.length > 0 ? users[users.length - 1] : null;
    };

    onMounted(() => {
      getCurrentUser();
      window.addEventListener('user-logged-in', getCurrentUser);
      window.addEventListener('user-logged-out', getCurrentUser);
    });

    const handleImageUpload = (e) => {
      const file = e.target.files[0];
      if (file) {
        imageFile.value = file;
      }
    };

    const publishPost = async () => {
      if (!title.value || !content.value || !currentUser.value) {
        alert('请先登录后再发布文章');
        return;
      }

      try {
        let imageId = null;

        if (imageFile.value) {
          const uploaded = await uploadImage(currentUser.value.token, imageFile.value);
          imageId = uploaded[0]?.id;
        }

        await createPost(
          currentUser.value.token,
          avatar.value,
          title.value,
          content.value,
          currentUser.value.username,
          imageId
        );

        alert('文章发布成功');
        // 清空表单
        avatar.value = '';
        title.value = '';
        content.value = '';
        imageFile.value = null;
      } catch (error) {
        console.error('发布失败', error);
        alert('发布失败，请稍后重试');
      }
    };

    return {
      title,
      content,
      imageFile,
      currentUser,
      handleImageUpload,
      publishPost
    };
  }
};
</script>
