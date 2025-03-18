<template>
  <button @click="toggleLanguage" type="button"
    class="relative p-0 text-gray-900 bg-gray-300 rounded-full hover:bg-gray-200 ">
    {{ language === 'zh' ? 'zh' : 'en' }}
  </button>
</template>

<script setup>
import { inject } from 'vue';

// 注入全局语言状态
const language = inject('language');

// 切换语言的方法
const toggleLanguage = () => {
  language.value = language.value === 'en' ? 'zh' : 'en';
};
</script>