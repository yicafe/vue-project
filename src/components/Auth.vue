<template>
  <div class="p-6 bg-gray-400 rounded-lg shadow-md">
    <!-- 标题 -->
    <h2></h2><br>

    <!-- 表单，用于登录或注册 -->
    <form @submit.prevent="handleAuth">
      <!-- 用户名输入框 -->
      <input v-model="identifier" placeholder="用户名/昵称" required />
      <br>

      <!-- 如果是注册模式，显示邮箱输入框 -->
      <input v-if="!isLogin" v-model="email" type="email" placeholder="邮箱" required />
      <br>

      <!-- 密码输入框 -->
      <input v-model="password" type="password" placeholder="密码" required /><br>

      <!-- 提交按钮，根据 isLogin 的值显示“登录”或“注册” -->
      <button
        class="inline-block px-6 py-0 font-medium text-center text-black bg-red-400 border border-transparent rounded-md hover:bg-red-500"
        type="submit">{{ isLogin ? "登录" : "注册" }}</button>
    </form>

    <!-- 切换登录/注册模式的按钮 -->
    <button
      class="inline-block px-4 py-0 font-medium text-center text-black bg-gray-300 border border-transparent rounded-md hover:bg-gray-200"
      @click="toggleAuth">{{ isLogin ? "没账号？注册" : "有账号？登录" }}</button>
    <br>
    <hr>

    <!-- 显示在线用户总数 -->
    <h3 >在线用户：{{ users.length }}</h3>

    <!-- 在线用户列表 -->
    <ul>
      <!-- 遍历 users 数组，显示每个用户的用户名和退出登录按钮 -->
      <li v-for="(user, index) in users" :key="index">
        {{ user.username }}
        <!-- 退出登录按钮 -->
        <button
          class="inline-block px-1 py-0 font-medium text-center text-black border border-transparent rounded-md bg-violet-300 hover:bg-violet-400"
          @click="handleLogout(user.username)">退出登录</button>
      </li>
    </ul>
  </div>
</template>

<script setup>
// 引入 Vue 的 ref 和 onMounted 函数
import { ref, onMounted } from 'vue';
// 引入 API 服务中的登录和注册函数
import { register, login } from '../services/api';

// 定义响应式变量
const identifier = ref(''); // 用户名
const email = ref(''); // 邮箱（仅在注册时使用）
const password = ref(''); // 密码
const isLogin = ref(true); // 当前是否为登录模式
const users = ref(JSON.parse(localStorage.getItem('users')) || []); // 在线用户列表

// 处理登录/注册的函数
const handleAuth = async () => {
  try {
    // 根据 isLogin 的值调用登录或注册接口
    const data = isLogin.value
      ? await login(identifier.value, password.value) // 登录
      : await register(identifier.value, email.value, password.value); // 注册（使用用户输入的邮箱）

    // 从 localStorage 中获取已存储的用户列表
    let storedUsers = JSON.parse(localStorage.getItem('users')) || [];

    // 如果当前用户不在列表中，则将其添加到列表中
    if (!storedUsers.some(user => user.username === data.user.username)) {
      storedUsers.push({ username: data.user.username, token: data.jwt });
    }

    // 更新 localStorage 中的用户列表
    localStorage.setItem('users', JSON.stringify(storedUsers));
    users.value = storedUsers; // 更新当前组件的用户列表

    // 触发全局事件，通知其他组件用户已登录
    window.dispatchEvent(new Event('user-logged-in'));
  } catch (error) {
    // 处理认证失败的情况
    console.error('认证失败', error);
  }
};

// 处理用户退出登录的函数
const handleLogout = (username) => {
  // 从 localStorage 中获取用户列表，并过滤掉退出的用户
  let storedUsers = JSON.parse(localStorage.getItem('users')) || [];
  storedUsers = storedUsers.filter(user => user.username !== username);

  // 更新 localStorage 中的用户列表
  localStorage.setItem('users', JSON.stringify(storedUsers));
  users.value = storedUsers; // 更新当前组件的用户列表

  // 触发全局事件，通知其他组件用户已退出
  window.dispatchEvent(new Event('user-logged-out'));
};

// 组件挂载时，从 localStorage 中获取用户列表并更新到组件状态
onMounted(() => {
  users.value = JSON.parse(localStorage.getItem('users')) || [];
});

// 切换登录/注册模式的函数
const toggleAuth = () => {
  isLogin.value = !isLogin.value;
};
</script>