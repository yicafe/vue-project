<template>
  <div class="relative overflow-hidden">
    <div class="max-w-2xl px-4 py-16 mx-auto sm:px-6 sm:py-24 lg:max-w-7xl lg:px-8">
      <h2 class="sr-only">Products</h2>
      <div class="grid grid-cols-2 gap-x-6 gap-y-10 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 xl:gap-x-8">
        <div v-for="product in products" :key="product.id" class="relative group" @mouseenter="product.showModel = true"
          @mouseleave="product.showModel = false">
          <a :href="product.href" class="block">
            <!-- 图片和模型容器 -->
            <div class="relative overflow-hidden bg-gray-700 rounded-lg aspect-square">
              <!-- 默认图片 -->
              <img v-if="!product.showModel" :src="product.imageUrl" alt="Product Image"
                class="w-full h-full object-cover transition-all duration-300 group-hover:scale-105 group-hover:brightness-110 group-hover:shadow-[0_0_15px_rgba(255,255,255,0.7)]" />
              <!-- 3D 模型 -->
              <ModelViewer v-else :model-url="product.modelUrl" :scale="0.5" :auto-rotate="true" :enable-zoom="false"
                :camera-position="{ x: 2, y: 2, z: 2 }" class="w-full h-full transition-all duration-300"
                background-color="#" />
            </div>
            <h3 class="mt-4 text-sm text-gray-700">{{ product.name }}</h3>
            <p class="mt-1 text-lg font-medium text-gray-900">{{ product.price }}</p>
          </a>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import ModelViewer from '../components/ModelViewer.vue'

const products = ref([
  {
    id: 1,
    name: 'model',
    href: '#',
    price: '',
    modelUrl: '../models3dgltf/cliooz.glb',
    imageUrl: 'https://my-strapi-project-h7zt.onrender.com/uploads/jannerugland_1_32bf48fd6a.jpg', // 替换为你的预览图片
    showModel: true,
  },
  {
    id: 2,
    name: 'model1',
    href: '',
    price: '',
    modelUrl: '../models3dgltf/model1.glb',
    imageUrl: 'https://my-strapi-project-h7zt.onrender.com/uploads/ellemaywatson_1_7ebe7c2088.jpg', // 替换为你的预览图片
    showModel: true,
  },
    {
    id: 3,
    name: 'model2',
    href: '0',
    price: '',
    modelUrl: '../models3dgltf/model2.glb',
    imageUrl: 'https://my-strapi-project-h7zt.onrender.com/uploads/thumbnail_6loh2449_14968e26cb_b227b258d7.png', // 替换为你的预览图片
    showModel: true,
  },
      {
    id: 3,
    name: 'model3',
    href: '0',
    price: '',
    modelUrl: '../models3dgltf/model3.glb',
    imageUrl: 'https://my-strapi-project-h7zt.onrender.com/uploads/thumbnail_6loh2449_14968e26cb_b227b258d7.png', // 替换为你的预览图片
    showModel: false,
  },
])
</script>

<style scoped>
/* 保持宽高比 */
.aspect-square {
  aspect-ratio: 1 / 1;
}

/* 悬停发光效果 */
.group:hover img {
  filter: brightness(1.1) drop-shadow(0 0 8px rgba(255, 255, 255, 0.8));
}

/* 卡片悬停上浮效果 */
.group:hover {
  transform: translateY(-2px);
  transition: transform 0.3s;
}
</style>
