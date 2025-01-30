<template>
    <div class="max-w-lg p-4 mx-auto bg-white rounded-lg shadow-lg">
      <h2 class="mb-4 text-lg font-bold">Create a New Post</h2>
      <!-- 表单 -->
      <form @submit.prevent="submitPost">
        <div v-for="field in fields" :key="field.id" class="mb-4">
          <label :for="field.id" class="block text-sm font-medium text-gray-700">
            {{ field.label }}
          </label>
          <component
            :is="field.type === 'textarea' ? 'textarea' : 'input'"
            v-model="formData[field.model]"
            :id="field.id"
            :type="field.type === 'textarea' ? undefined : field.type"
            :required="field.required"
            class="block w-full mt-1 border-gray-300 rounded-md shadow-sm"
          ></component>
        </div>
        <button
          type="submit"
          class="flex items-center justify-center px-4 py-2 text-white bg-blue-500 rounded-lg hover:bg-blue-600"
          :disabled="isSubmitting"
        >
          <span v-if="isSubmitting" class="w-4 h-4 mr-2 spinner-border animate-spin"></span>
          {{ isSubmitting ? 'Submitting...' : 'Submit' }}
        </button>
      </form>
  
      <!-- 错误提示 -->
      <p v-if="error" class="mt-4 text-red-500">{{ error }}</p>
      <!-- 成功提示 -->
      <p v-if="success" class="mt-4 text-green-500">{{ success }}</p>
    </div>
  </template>
  
  <script setup lang="ts">
  import { ref } from 'vue';
  import { createPost } from '@/services/PostService';
  
  // 动态表单字段配置
  const fields = [
    { id: 'username', label: 'Username', model: 'username', type: 'text', required: true },
    { id: 'content', label: 'Content', model: 'content', type: 'textarea', required: true },
    { id: 'avatar', label: 'Avatar URL', model: 'avatar.url', type: 'url', required: false },
    { id: 'image', label: 'Image URL', model: 'image.url', type: 'url', required: false },
  ];
  
  // 表单数据
  const formData = ref({
    username: '',
    content: '',
    avatar: { url: '' },
    image: { url: '' },
  });
  
  const isSubmitting = ref(false);
  const error = ref<string | null>(null);
  const success = ref<string | null>(null);
  
  // 提交表单
  const submitPost = async () => {
    isSubmitting.value = true;
    error.value = null;
    success.value = null;
  
    try {
      await createPost(formData.value); // 调用服务层方法提交数据
      success.value = 'Post created successfully!';
      // 清空表单
      Object.keys(formData.value).forEach((key) => {
        if (typeof formData.value[key] === 'object') {
          formData.value[key] = {};
        } else {
          formData.value[key] = '';
        }
      });
    } catch (err: any) {
      error.value = err.response?.data?.message || 'Failed to create post. Please try again.';
      console.error(err);
    } finally {
      isSubmitting.value = false;
    }
  };
  </script>
  
  <style scoped>
  /* 添加加载 Spinner 样式 */
  .spinner-border {
    border: 2px solid #f3f3f3;
    border-top: 2px solid #3498db;
    border-radius: 50%;
    width: 16px;
    height: 16px;
  }
  </style>
  