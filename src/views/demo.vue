<template>
  <div class="app">
    <div class="card-container">
      <ImageDisplay
        defaultImage="https://my-strapi-project-h7zt.onrender.com/uploads/jannerugland_1_32bf48fd6a.jpg"
        hoverImage="https://my-strapi-project-h7zt.onrender.com/uploads/ellemaywatson_1_7ebe7c2088.jpg"
        labelText="quick view"
        link=""
        altText="示例图片"
      />
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
  justify-content: center;
  flex-wrap: wrap;
  gap: 20px;
}
</style>
