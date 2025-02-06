<template>
  <div>
    <h2>登录 / 注册</h2>
    <form @submit.prevent="handleAuth">
      <input v-model="identifier" placeholder="用户名 / 邮箱" required />
      <input v-model="password" type="password" placeholder="密码" required />
      <button type="submit">{{ isLogin ? "登录" : "注册" }}</button>
    </form>
    <button @click="toggleAuth">{{ isLogin ? "去注册" : "去登录" }}</button>

    <!-- 在线用户总数 -->
    <h3>当前在线用户：{{ users.length }}</h3>
    <ul>
      <li v-for="(user, index) in users" :key="index">
        {{ user.username }} 
        <button @click="handleLogout(user.username)">退出登录</button>
      </li>
    </ul>
  </div>
</template>

<script>
import { ref, onMounted } from 'vue';
import { register, login } from '../services/api';

export default {
  setup() {
    const identifier = ref('');
    const password = ref('');
    const isLogin = ref(true);
    const users = ref(JSON.parse(localStorage.getItem('users')) || []);

    // 处理登录/注册
    const handleAuth = async () => {
      try {
        const data = isLogin.value
          ? await login(identifier.value, password.value)
          : await register(identifier.value, `${identifier.value}@test.com`, password.value);

        let storedUsers = JSON.parse(localStorage.getItem('users')) || [];
        if (!storedUsers.some(user => user.username === data.user.username)) {
          storedUsers.push({ username: data.user.username, token: data.jwt });
        }

        localStorage.setItem('users', JSON.stringify(storedUsers));
        users.value = storedUsers;

        window.dispatchEvent(new Event('user-logged-in')); // 通知其他组件
      } catch (error) {
        console.error('认证失败', error);
      }
    };

    // 处理退出登录
    const handleLogout = (username) => {
      let storedUsers = JSON.parse(localStorage.getItem('users')) || [];
      storedUsers = storedUsers.filter(user => user.username !== username);
      localStorage.setItem('users', JSON.stringify(storedUsers));
      users.value = storedUsers;

      window.dispatchEvent(new Event('user-logged-out')); // 通知其他组件
    };

    // 组件挂载时更新用户状态
    onMounted(() => {
      users.value = JSON.parse(localStorage.getItem('users')) || [];
    });

    const toggleAuth = () => {
      isLogin.value = !isLogin.value;
    };

    return { identifier, password, isLogin, users, handleAuth, handleLogout, toggleAuth };
  },
};
</script>
