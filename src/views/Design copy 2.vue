<template>
  <div class="relative overflow-hidden">
    <div class="max-w-2xl px-4 py-16 mx-auto sm:px-6 sm:py-24 lg:max-w-7xl lg:px-8">
      <h2 class="sr-only">Products</h2>

      <div class="grid grid-cols-2 gap-x-6 gap-y-10 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 xl:gap-x-8">
        <a v-for="product in products" :key="product.id" :href="product.href" class="group">
          <!-- 替换图片为3D模型查看器 -->
          <div class="relative bg-gray-200 rounded-lg aspect-square group-hover:opacity-75 xl:aspect-7/8">
            <ModelViewer 
              :model-url="product.modelUrl"
              :scale="0.5"
              :auto-rotate="true"
              :enable-zoom="false"
              :camera-position="{ x: 2, y: 2, z: 2 }"
              class="w-full h-full transition-transform duration-300 rounded-lg group-hover:scale-105"
              background-color="#"
            />
          </div>
          <h3 class="mt-4 text-sm text-gray-700">{{ product.name }}</h3>
          <p class="mt-1 text-lg font-medium text-gray-900">{{ product.price }}</p>
        </a>
      </div>
    </div>
  </div>
</template>

<script setup>
import ModelViewer from '../components/ModelViewer.vue' // 导入之前创建的模型查看器组件

const products = [
  {
    id: 1,
    name: 'Spinel model',
    //href: '#',
    price: '1',
    modelUrl: '../models3dgltf/model.glb', // 模型文件路径
  },
  {
    id: 2,
    name: 'rhino model',
    //href: '#',
    price: '2',
    modelUrl: '../models3dgltf/model1.glb',
  },

]
</script>

<style>
/* 调整模型查看器样式 */
.model-container {
  width: 100%;
  height: 300px; /* 缩小高度适应网格布局 */
  min-height: 300px;
  position: relative;
}

/* 保持宽高比 */
.aspect-square {
  aspect-ratio: 1 / 1;
}
</style>