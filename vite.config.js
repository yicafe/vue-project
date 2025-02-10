import { fileURLToPath, URL } from 'node:url'

import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import vueDevTools from 'vite-plugin-vue-devtools'
//import { visualizer } from 'rollup-plugin-visualizer';// 打包后自动打开分析页面

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    vue(),
    vueDevTools(),
  ],
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url))
    },
  },

  /*
  plugins: [
    vue(),
    visualizer({
      open: true, // 打包后自动打开分析页面
    }),
  ],
  */

  build: {
    chunkSizeWarningLimit: 1000, // 将 chunk 大小警告限制提高到 1000 （默认为500）
  },
})

