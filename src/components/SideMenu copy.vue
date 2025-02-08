<template>
  <div class="flex min-h-screen">
    <!-- 菜单栏 -->
    <div class="w-64 h-full text-black transition-all duration-200 ease-in-out bg-gray-300" :class="{ '-ml-64': !isMenuOpen }">
      <div class="p-4 pt-16">
        <h2 class="text-lg font-semibold">🍒🦭</h2>
        <div>
          <Login></Login>
        </div>
        <ul class="mt-4 space-y-2">
          <li><a href="https://cliooz.cn/#/PostList" class="block p-2 rounded bg-violet-300 hover:bg-violet-400">最新帖子</a></li>
          <!--
          <li><a href="#" class="block p-2 rounded hover:bg-gray-400">发现</a></li>
          <li><a href="#" class="block p-2 rounded hover:bg-gray-400">消息</a></li>
          <li><a href="#" class="block p-2 rounded hover:bg-gray-400">个人中心</a></li>
          -->
        </ul>
      </div>
    </div>

    <!-- 内容区域 -->
    <div class="flex-1 overflow-hidden">
      <!-- 菜单切换按钮 -->
      <button @click="toggleMenu"
        class="fixed z-50 p-2 text-white transition-colors bg-gray-500 rounded-lg bottom-4 left-4 hover:bg-gray-400">
        <!-- 使用 Unicode 字符作为图标 -->
        <span v-if="isMenuOpen" class="text-1xl">🤗</span> <!-- 显示汉堡菜单图标 -->
        <span v-else class="text-1xl">✍</span> <!-- 显示关闭图标 -->

        <!-- 或者使用 SVG 图标 -->
        <!--
      <svg v-if="isMenuOpen" xmlns="http://www.w3.org/2000/svg" class="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16M4 18h16" />
      </svg>
      <svg v-else xmlns="http://www.w3.org/2000/svg" class="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
      </svg>
      -->

        <!-- 或者使用图片 -->
        <!--
      <img v-if="isMenuOpen" src="@/assets/menu-icon.png" alt="菜单图标" class="w-6 h-6" />
      <img v-else src="@/assets/close-icon.png" alt="关闭图标" class="w-6 h-6" />
      -->
      </button>

      <router-view></router-view>
    </div>
  </div>
</template>

<script setup>
import Login from '@/views/Login.vue';
import { ref } from 'vue';

// 菜单栏状态，初始值为 true（默认显示）false 为隐藏
const isMenuOpen = ref(false);

// 切换菜单栏显示/隐藏
const toggleMenu = () => {
  isMenuOpen.value = !isMenuOpen.value;
};


</script>

<style>
/* 自定义样式 */
</style>