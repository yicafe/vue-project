<template>
  <div class="flex items-center justify-center h-screen">
    <div class="p-6 text-center bg-gray-100 rounded-lg shadow-lg">
      <h1 class="mb-4 text-xl font-bold">计数器</h1>
      <div class="mb-4 text-2xl">
        <span>{{ count }}</span>
      </div>
      <div class="flex justify-around">
        <button 
          @click="decrement" 
          class="px-4 py-2 text-white bg-red-500 rounded hover:bg-red-600 focus:outline-none">
          减少
        </button>
        <button 
          @click="increment" 
          class="px-4 py-2 text-white bg-blue-500 rounded hover:bg-blue-600 focus:outline-none">
          增加
        </button>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      count: 0, // 初始化计数值
    };
  },
  methods: {
    increment() {
      this.count += 1; // 增加计数
    },
    decrement() {
      this.count -= 1; // 减少计数
    },
  },
};
</script>

<style scoped>
/* 样式会由 Tailwind CSS 自动处理 */
</style>
