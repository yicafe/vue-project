<template>
  <div class="os-wrapper">
    <iframe
      ref="osFrame"
      src="/redhat-os.html"
      class="os-iframe"
      allow="fullscreen"
    ></iframe>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'

const osFrame = ref(null)

onMounted(() => {
  // 可选项：等 iframe 加载完后，传入自定义的 Strapi 地址
  osFrame.value?.addEventListener('load', () => {
    const win = osFrame.value.contentWindow
    // 例如从环境变量读 Strapi 地址
    const strapiUrl = import.meta.env.VITE_STRAPI_URL || 'http://localhost:1337'
    win?.postMessage({ type: 'setStrapiUrl', url: strapiUrl }, '*')
  })
})
</script>

<style scoped>
.os-wrapper {
  width: 100%;
  height: 100vh;
  display: flex;
  justify-content: center;
  align-items: center;
  background: #1a1a1a;
}
.os-iframe {
  width: 100%;
  height: 100%;
  border: none;
  display: block;
}
</style>