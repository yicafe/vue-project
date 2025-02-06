<template>
  <div>
    <h2>注册</h2><br>
    <input v-model="username" placeholder="用户名" /><br>
    <input v-model="email" placeholder="邮箱" /><br>
    <input v-model="password" type="password" placeholder="密码" /><br>
    <button @click="register">注册</button><br>
    <p v-if="message">{{ message }}</p><br>
  </div>
</template>

<script>
import api from "@/services/api";

export default {
  data() {
    return {
      username: "",
      email: "",
      password: "",
      message: "",
    };
  },
  methods: {
    async register() {
      try {
        const res = await api.post("/auth/local/register", {
          username: this.username,
          email: this.email,
          password: this.password,
        });
        this.message = "注册成功，请登录";
      } catch (error) {
        this.message = error.response?.data?.error?.message || "注册失败";
      }
    },
  },
};
</script>
