<template>
  <div class="app">
    <div class="card-container">
      <!-- 卡片1 -->
      <div class="card-wrapper">
        <ImageDisplay
          defaultImage="https://my-strapi-project-h7zt.onrender.com/uploads/jannerugland_1_32bf48fd6a.jpg"
          hoverImage="https://my-strapi-project-h7zt.onrender.com/uploads/ellemaywatson_1_7ebe7c2088.jpg"
          labelText="quick view"
          link=""
          altText="示例图片1"
        />
      </div>
      <!-- 卡片2 -->
      <div class="card-wrapper">
        <ImageDisplay
          defaultImage="https://my-strapi-project-h7zt.onrender.com/uploads/another_image_1.jpg"
          hoverImage="https://my-strapi-project-h7zt.onrender.com/uploads/another_image_2.jpg"
          labelText="quick view"
          link=""
          altText="示例图片2"
        />
      </div>
    </div>
  </div>
</template>

<script setup>
import ImageDisplay from '../components/ImageDisplay.vue';
</script>

<style>
.app {
  font-family: Arial, sans-serif;
  text-align: center;
  margin: 20px;
}
.card-container {
  display: flex;
  justify-content: flex-start; /* 从左到右排序 */
  flex-wrap: wrap;
  gap: 1px; /* 卡片之间的间距 */
}
.card-wrapper {
  transition: transform 0.3s ease; /* 添加过渡效果 */
}
.card-wrapper:hover {
  transform: scale(1.25); /* 鼠标悬停时放大 */
}
</style>
