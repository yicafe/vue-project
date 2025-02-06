<template>
  <div>
    <h2>发布文章</h2>
    <input v-model="title" placeholder="标题" />
    <textarea v-model="content" placeholder="内容"></textarea>
    <button @click="createArticle">发布</button>
    <p v-if="message">{{ message }}</p>
  </div>
</template>

<script>
import api from "@/services/api"; // 确保 api.js 存在并正确配置

export default {
  data() {
    return {
      title: "",
      content: "",
      message: "",
    };
  },
  methods: {
    async createArticle() {
      try {
        const res = await api.post("/articles", {
          data: {
            title: this.title,
            content: this.content,
          },
        });
        this.message = "发布成功！";
      } catch (error) {
        this.message = error.response?.data?.error?.message || "发布失败";
      }
    },
  },
};
</script>
