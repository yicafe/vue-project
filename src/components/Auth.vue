<template>
  <div>
    <h2></h2><br>
    <form @submit.prevent="handleAuth">
      <input v-model="identifier" placeholder="用户名/邮箱" required />
      <br>
      <hr>
      <input v-model="password" type="password" placeholder="密码" required /><br>
      <button class="inline-block px-6 py-0 font-medium text-center text-black bg-red-400 border border-transparent rounded-md hover:bg-red-500" type="submit">{{ isLogin ? "登录" : "注册" }}</button>
    </form>
    <button class="inline-block px-4 py-0 font-medium text-center text-black bg-gray-300 border border-transparent rounded-md hover:bg-gray-200" @click="toggleAuth">{{ isLogin ? "没账号" : "有账号" }}</button>
    <br>
    <hr>

    <!-- 在线用户总数 -->
    <h3>在线用户：{{ users.length }}</h3>
    <ul>
      <li v-for="(user, index) in users" :key="index">
        {{ user.username }} 
        <button class="inline-block px-1 py-0 font-medium text-center text-black border border-transparent rounded-md bg-violet-300 hover:bg-violet-400" @click="handleLogout(user.username)">退出登录</button>
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
