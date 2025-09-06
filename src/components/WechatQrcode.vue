<template>
  <div class="fixed z-50 bottom-5 left-50">
    <!-- 二维码图标按钮 -->
    <div
      class="fixed z-50 p-2 text-white transition-colors rounded-lg bg-white-500 bottom-4 left-16 hover:bg-gray-400"
      @click="showQrcode = !showQrcode"
    >
      <img
        src="@/assets/cliooz.png"  
        alt="二维码图标"
        class="h-6 w-18"
      />
    </div>

    <!-- 二维码弹出框 -->
    <div
      v-show="showQrcode"
      class="fixed p-2 bg-white border border-gray-200 rounded-lg shadow-lg bottom-16 left-16 w-36 h-36"
    >
      <img
        src="@/assets/WechatQrcode.png"
        alt="二维码"
        class="object-contain w-full h-full rounded"
      />
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue';
const showQrcode = ref(false);
</script>
