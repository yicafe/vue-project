<template>
  <div class="card">
    <a :href="link" target="_blank" class="card-link">
      <div
        class="image-wrapper"
        @mouseover="showHoverImage = true"
        @mouseleave="showHoverImage = false"
      >
        <img
          :src="defaultImage"
          :alt="altText"
          class="default-image"
          :class="{ 'glow-effect': showHoverImage }"
        />
        <img
          v-if="showHoverImage"
          :src="hoverImage"
          :alt="altText"
          class="hover-image"
        />
        <div v-if="showHoverImage" class="image-label">
          {{ labelText }}
        </div>
      </div>
    </a>
  </div>
</template>

<script setup>
import { ref } from 'vue';

const props = defineProps({
  defaultImage: {
    type: String,
    required: true,
  },
  hoverImage: {
    type: String,
    required: true,
  },
  labelText: {
    type: String,
    required: true,
  },
  link: {
    type: String,
    required: true,
  },
  altText: {
    type: String,
    default: 'Image',
  },
});

const showHoverImage = ref(false);
</script>

<style scoped>
.card {
  display: inline-block;
  margin: 20px;
  border-radius: 8px;
  overflow: hidden;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
  transition: transform 0.3s, box-shadow 0.3s;
  background: white;
  width: 300px;
}

.card:hover {
  transform: translateY(-5px);
  box-shadow: 0 6px 12px rgba(0, 0, 0, 0.15);
}

.card-link {
  text-decoration: none;
  color: inherit;
}

.image-wrapper {
  position: relative;
  width: 100%;
  height: 200px;
  overflow: hidden;
}

.default-image,
.hover-image {
  width: 100%;
  height: 100%;
  object-fit: cover;
  transition: all 0.3s;
}

.hover-image {
  position: absolute;
  top: 0;
  left: 0;
}

.glow-effect {
  filter: brightness(1.1) drop-shadow(0 0 8px rgba(255, 255, 255, 0.8));
}

.image-label {
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  background: #e6e6e0;
  color: rgb(0, 0, 0);
  padding: 10px;
  text-align: center;
  transform: translateY(100%);
  transition: transform 0.3s;
}

.image-wrapper:hover .image-label {
  transform: translateY(0);
}
</style>
