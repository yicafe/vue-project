<template>
  <!--
    This example requires updating your template:

    ```
    <html class="h-full bg-white">
    <body class="h-full">
    ```
  -->
  <!-- 页面主体 -->
  <div class="flex flex-col justify-center flex-1 min-h-full px-6 py-12 lg:px-8">
    <div class="sm:mx-auto sm:w-full sm:max-w-sm">
      <img class="w-auto h-10 mx-auto" src="https://cliooz.com/logo.png?color=indigo&shade=600" alt="Your Company" />
      <h2 class="mt-10 font-bold tracking-tight text-center text-gray-900 text-2xl/9">注册你的账号</h2>
    </div>

    <!-- 注册表单 -->
    <div class="mt-10 sm:mx-auto sm:w-full sm:max-w-sm">
      <form class="space-y-6" action="#" method="POST">
        <div class="mb-4">
          <label for="username" class="block text-gray-700">用户名</label>
          <input type="text" id="username" name="username"
            class="w-full px-4 py-2 mt-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            required>
        </div>

        <div>
          <label for="email" class="block font-medium text-gray-900 text-sm/6">电子邮箱</label>
          <div class="mt-2">
            <input type="email" name="email" id="email" autocomplete="email" required="" class="block w-full rounded-md bg-white px-3 py-1.5 text-base text-gray-900 outline outline-1 -outline-offset-1 outline-gray-300 placeholder:text-gray-400 focus:outline focus:outline-2 focus:-outline-offset-2 focus:outline-indigo-600 sm:text-sm/6" />
          </div>
        </div>

        <div>
          <div class="flex items-center justify-between">
            <label for="password" class="block font-medium text-gray-900 text-sm/6">密码</label>
            <div class="text-sm">
              <a href="#" class="font-semibold text-indigo-600 hover:text-indigo-500">Forgot password?</a>
            </div>
          </div>
          <div class="mt-2">
            <input type="password" name="password" id="password" autocomplete="current-password" required="" class="block w-full rounded-md bg-white px-3 py-1.5 text-base text-gray-900 outline outline-1 -outline-offset-1 outline-gray-300 placeholder:text-gray-400 focus:outline focus:outline-2 focus:-outline-offset-2 focus:outline-indigo-600 sm:text-sm/6" />
          </div>
        </div>

        <div>
          <button type="submit" class="flex w-full justify-center rounded-md bg-indigo-600 px-3 py-1.5 text-sm/6 font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600">注册</button>
        </div>
      </form>

      <p class="mt-10 text-center text-gray-500 text-sm/6">
        有账号?
        {{ ' ' }}
        <router-link to="login" class="text-blue-500 hover:text-blue-700">登录</router-link>
      </p>
    </div>
  </div>
  <router-link to="/">跳转首页</router-link>
  <router-link to="login">跳转登录页</router-link>

</template>
