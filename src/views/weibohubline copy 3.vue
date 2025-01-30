<template>
  <div class="max-w-4xl p-4 mx-auto bg-white media-container">
    <!-- 图片 -->
    <div v-if="isImage(mediaUrl)" class="mb-4">
      <img :src="mediaUrl" alt="Image" class="w-full h-auto rounded-lg shadow-md" />
    </div>

    <!-- 视频文件 -->
    <div v-else-if="isVideo(mediaUrl)" class="mb-4">
      <video controls :src="mediaUrl" class="w-full h-auto rounded-lg shadow-md"></video>
    </div>

    <!-- 哔哩哔哩视频 -->
    <div v-else-if="isBilibiliVideo(mediaUrl)" class="mb-4">
      <iframe
        :src="getBilibiliEmbedUrl(mediaUrl)"
        scrolling="no"
        border="0"
        frameborder="no"
        framespacing="0"
        allowfullscreen="#"
        class="w-full h-[315px] rounded-lg shadow-md"
      ></iframe>
    </div>

    <!-- 不支持的媒体类型 -->
    <div v-else>
      <p class="text-center text-gray-500">Unsupported media type</p>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      // 示例链接可以是哔哩哔哩视频的 bvid 或完整视频嵌入 URL
      mediaUrl: "BV19wkwYBEMt", // 哔哩哔哩视频的 bvid 示例
    };
  },
  methods: {
    // 判断是否为图片
    isImage(url) {
      return /\.(jpg|jpeg|png|gif|webp)$/i.test(url);
    },

    // 判断是否为视频文件
    isVideo(url) {
      return /\.(mp4|webm|ogg)$/i.test(url);
    },

    // 判断是否为哔哩哔哩视频链接（可以是 bvid 或完整的 embed URL）
    isBilibiliVideo(url) {
      return /^(BV|av|https?:\/\/player\.bilibili\.com)/i.test(url);
    },

    // 动态生成哔哩哔哩视频的嵌入 URL
    getBilibiliEmbedUrl(url) {
      if (url.startsWith("http")) {
        // 如果是完整的嵌入 URL，直接返回
        return url;
      }
      // 如果是 bvid 或 av 号，生成嵌入链接
      return `//player.bilibili.com/player.html?isOutside=true&bvid=${url}&p=1`;
    },
  },
};
</script>

<style scoped>
.media-container {
  max-width: 800px;
  margin: 0 auto;
  padding: 16px;
  background-color: #fff;
}

img, video, iframe {
  width: 100%;
  height: auto;
  border-radius: 8px;
  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.1);
}

p {
  text-align: center;
  color: #888;
}
</style>
