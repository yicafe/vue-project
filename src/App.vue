<template>
  <div class="min-h-screen bg-[#f1efee]">
    <!-- 头部 -->
    <header class="fixed top-0 left-0 z-50 w-full bg-white shadow-md">
      <Disclosure as="nav" class="bg-white" v-slot="{ open }">
        <div class="px-2 mx-auto max-w-7xl sm:px-6 lg:px-8">
          <div class="relative flex items-center justify-between h-16">
            <div class="absolute inset-y-0 left-0 flex items-center sm:hidden">
              <!-- Mobile menu button-->
              <DisclosureButton
                class="relative inline-flex items-center justify-center p-2 text-gray-400 rounded-md hover:bg-gray-300 hover:text-white focus:outline-none focus:ring-2 focus:ring-inset focus:ring-white">
                <span class="absolute -inset-0.5" />
                <span class="sr-only">Open main menu</span>
                <Bars3Icon v-if="!open" class="block size-6" aria-hidden="true" />
                <XMarkIcon v-else class="block size-6" aria-hidden="true" />
              </DisclosureButton>
              <!-- 搜索组件 -->
              <SearchModal />
            </div>
            <div class="flex items-center justify-center flex-1 sm:items-stretch sm:justify-start">
              <div class="flex items-center shrink-0">
                <img class="w-auto h-8" src="https://cliooz.com/logo.png?color=indigo&shade=500" alt="Your Company" />
              </div>
              <div class="hidden sm:ml-6 sm:block">
                <div class="flex space-x-4">
                  <a v-for="item in navigation" :key="item.name" :href="item.href"
                    :class="[item.current ? 'bg-white text-gray-700' : 'text-gray-900 hover:bg-pink-400 hover:text-white', 'rounded-md px-3 py-2 text-sm font-medium']"
                    :aria-current="item.current ? 'page' : undefined">{{ item.name }}</a>
                </div>
                <!-- 搜索组件 -->
                <SearchModal />
              </div>
            </div>
            <div class="absolute inset-y-0 right-0 flex items-center pr-2 sm:static sm:inset-auto sm:ml-6 sm:pr-0">
              <!-- 语言切换组件 -->
              <LanguageSwitcher />

              <!--View notifications菜单栏消息通知提醒待开发
              <button type="button"
                class="relative p-1 text-gray-400 bg-gray-800 rounded-full hover:text-white focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-gray-800">
                <span class="absolute -inset-1.5" />
                <span class="sr-only">View notifications</span>
                <BellIcon class="size-6" aria-hidden="true" />
              </button>
              -->

              <!-- Profile dropdown -->
              <Menu as="div" class="relative ml-3">
                <div>
                  <MenuButton
                    class="relative flex text-sm bg-gray-800 rounded-full focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-gray-800">
                    <span class="absolute -inset-1.5" />
                    <span class="sr-only">Open user menu</span>
                    <img class="rounded-full size-8"
                      src="https://my-strapi-project-h7zt.onrender.com/uploads/thumbnail_6loh2449_14968e26cb_b227b258d7.png?updatedAt=2025-04-05T17%3A55%3A42.196Z"
                      alt="" />
                  </MenuButton>
                </div>
                <transition enter-active-class="transition duration-100 ease-out"
                  enter-from-class="transform scale-95 opacity-0" enter-to-class="transform scale-100 opacity-100"
                  leave-active-class="transition duration-75 ease-in" leave-from-class="transform scale-100 opacity-100"
                  leave-to-class="transform scale-95 opacity-0">
                  <MenuItems
                    class="absolute right-0 z-10 w-48 py-1 mt-2 origin-top-right bg-white rounded-md shadow-lg ring-1 ring-black/5 focus:outline-none">
                    <MenuItem v-slot="{ active }">
                    <a href="#"
                      :class="[active ? 'bg-gray-100 outline-none' : '', 'block px-4 py-2 text-sm text-gray-700']">
                      <router-link to="Profile" class="text-blue-500 hover:text-blue-700">
                        {{ language === 'en' ? 'Your Profile' : '个人资料' }}
                      </router-link>
                    </a>
                    </MenuItem>
                    <MenuItem v-slot="{ active }">
                    <a href="#"
                      :class="[active ? 'bg-gray-100 outline-none' : '', 'block px-4 py-2 text-sm text-gray-700']">
                      {{ language === 'en' ? 'Settings' : '设置' }}
                    </a>
                    </MenuItem>
                    <!--功能待开发
                    <MenuItem v-slot="{ active }">
                      <a href="#"
                        :class="[active ? 'bg-gray-100 outline-none' : '', 'block px-4 py-2 text-sm text-gray-700']">
                        {{ language === 'en' ? 'Sign out' : '退出登录' }}
                      </a>
                    </MenuItem>
                    <MenuItem v-slot="{ active }">
                      <a href="#"
                        :class="[active ? 'bg-gray-100 outline-none' : '', 'block px-4 py-2 text-sm text-gray-700']">
                        <router-link to="login" class="text-blue-500 hover:text-blue-700">
                          {{ language === 'en' ? 'Login' : '登录' }}
                        </router-link>
                      </a>
                    </MenuItem>
                    -->
                  </MenuItems>
                </transition>
              </Menu>
            </div>
          </div>
        </div>
        <DisclosurePanel class="sm:hidden">
          <div class="px-2 pt-2 pb-3 space-y-1">
            <DisclosureButton v-for="item in navigation" :key="item.name" as="a" :href="item.href"
              :class="[item.current ? 'bg-gray-900 text-white' : 'text-gray-700 hover:bg-gray-700 hover:text-white', 'block rounded-md px-3 py-2 text-base font-medium']"
              :aria-current="item.current ? 'page' : undefined">{{ item.name }}</DisclosureButton>
          </div>
        </DisclosurePanel>
      </Disclosure>
    </header>

    <!-- 列表 -->
    <main class="flex-grow py-8">
      <!--<router-view></router-view>-->
      <SideMenu></SideMenu>
    </main>

    <!-- 底部 -->
    <footer class="bottom-0 left-0 w-full ">
      <div class="container mx-auto text-center text-gray-500">
        <!-- 使用flex容器包裹所有内容 -->
        <div class="flex items-center justify-center space-x-4">
          <!--<p>
            {{ language === 'zh' ? '© 2023 My Personal Website, All rights reserved.' : '© 2023 我的个人网站，保留所有权利。' }}
          </p>-->
          <!-- 版权信息 -->
          <p class="text-sm text-gray-600">
            <template v-if="language === 'en'">
              ©
              <a href="https://cliooz.cn" target="_blank" rel="noopener noreferrer"
                class="font-medium text-pink-300 transition-colors duration-200 hover:text-gray-500">
                CLIOOZ
              </a>
              2023，保留所有权利。
            </template>
            <template v-else>
              ©
              <a href="https://cliooz.cn" target="_blank" rel="noopener noreferrer"
                class="font-medium text-pink-300 transition-colors duration-200 hover:text-gray-500">
                CLIOOZ
              </a>
              2023, All rights reserved.
            </template>
          </p>
          <!-- 社交媒体图标 -->
          <div class="flex items-center space-x-4">
            <!-- GitHub 
            <a href="https://github.com" target="_blank" rel="noopener noreferrer"
              class="text-gray-500 transition-colors duration-200 hover:text-sky-500">
              <span class="sr-only">GitHub</span>
              <svg class="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                <path fill-rule="evenodd"
                  d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z" />
              </svg>
            </a>
          -->
            <!-- Bilibili图标来源fontawesome -->
            <a href="https://space.bilibili.com/107561216" target="_blank" rel="noopener noreferrer"
              class="text-gray-500 transition-colors duration-200 hover:text-sky-500">
              <span class="sr-only">Bilibili</span>
              <svg class="w-5 h-5" viewBox="0 0 512 512" aria-hidden="true">
                <path fill="currentColor"
                  d="M488.6 104.1C505.3 122.2 513 143.8 511.9 169.8V372.2C511.5 398.6 502.7 420.3 485.4 437.3C468.2 454.3 446.3 463.2 419.9 464H92C65.6 463.2 43.8 454.2 26.7 436.8C9.7 419.4 .8 396.5 0 368.2V169.8C.8 143.8 9.7 122.2 26.7 104.1C43.8 87.8 65.6 78.8 92 78H121.4L96.1 52.2C90.3 46.5 87.4 39.2 87.4 30.4C87.4 21.6 90.3 14.3 96.1 8.6C101.8 2.9 109.1 0 117.9 0C126.7 0 134 2.9 139.8 8.6L213.1 78H301.1L375.6 8.6C381.7 2.9 389.2 0 398 0C406.8 0 414.1 2.9 419.9 8.6C425.6 14.3 428.5 21.6 428.5 30.4C428.5 39.2 425.6 46.5 419.9 52.2L394.6 78L423.9 78C450.3 78.8 471.9 87.8 488.6 104.1H488.6zM449.8 173.8C449.4 164.2 446.1 156.4 439.1 150.3C433.9 144.2 425.1 140.9 416.4 140.5H96.1C86.5 140.9 78.6 144.2 72.5 150.3C66.3 156.4 63.1 164.2 62.7 173.8V368.2C62.7 377.4 66 385.2 72.5 391.7C79 398.2 86.9 401.5 96.1 401.5H416.4C425.6 401.5 433.4 398.2 439.7 391.7C446 385.2 449.4 377.4 449.8 368.2L449.8 173.8zM185.5 216.5C191.8 222.8 195.2 230.6 195.6 239.7V273C195.2 282.2 191.9 289.9 185.8 296.2C179.6 302.5 171.8 305.7 162.2 305.7C152.6 305.7 144.7 302.5 138.6 296.2C132.5 289.9 129.2 282.2 128.8 273V239.7C129.2 230.6 132.6 222.8 138.9 216.5C145.2 210.2 152.1 206.9 162.2 206.5C171.4 206.9 179.2 210.2 185.5 216.5H185.5zM377 216.5C383.3 222.8 386.7 230.6 387.1 239.7V273C386.7 282.2 383.4 289.9 377.3 296.2C371.2 302.5 363.3 305.7 353.7 305.7C344.1 305.7 336.3 302.5 330.1 296.2C323.1 289.9 320.7 282.2 320.4 273V239.7C320.7 230.6 324.1 222.8 330.4 216.5C336.7 210.2 344.5 206.9 353.7 206.5C362.9 206.9 370.7 210.2 377 216.5H377z" />
              </svg>
            </a>
            <!-- TikTok图标 
            <a href="https://www.douyin.com" target="_blank" rel="noopener noreferrer"
              class="text-gray-500 transition-colors duration-200 hover:text-sky-500 group">
              <span class="sr-only">TikTok</span>
              <svg class="w-5 h-5" viewBox="0 0 448 512" aria-hidden="true">
                <path fill="currentColor"
                  d="M448 209.9a210.1 210.1 0 0 1 -122.8-39.3V349.4A162.6 162.6 0 1 1 185 188.3V278.2a74.6 74.6 0 1 0 52.2 71.2V0l88 0a121.2 121.2 0 0 0 1.9 22.2h0A122.2 122.2 0 0 0 381 102.4a121.4 121.4 0 0 0 67 20.1z" />
              </svg>
            </a>-->
            <!-- 邮件图标 -->
            <a href="mailto:@163.com" class="text-gray-600 transition-colors duration-200 hover:text-yellow-500"
              aria-label="Email">
              <svg class="w-5 h-5" viewBox="0 0 512 512" aria-hidden="true">
                <path fill="currentColor"
                  d="M48 64C21.5 64 0 85.5 0 112c0 15.1 7.1 29.3 19.2 38.4L236.8 313.6c11.4 8.5 27 8.5 38.4 0L492.8 150.4c12.1-9.1 19.2-23.3 19.2-38.4c0-26.5-21.5-48-48-48L48 64zM0 176L0 384c0 35.3 28.7 64 64 64l384 0c35.3 0 64-28.7 64-64l0-208L294.4 339.2c-22.8 17.1-54 17.1-76.8 0L0 176z" />
              </svg>
            </a>
          </div>
        </div>
      </div>
    </footer>
          <!-- rqcode -->
    <WechatQrcode />
  </div>

</template>

<script setup>
import { provide, ref, onMounted } from 'vue';
import { Disclosure, DisclosureButton, DisclosurePanel, Menu, MenuButton, MenuItem, MenuItems } from '@headlessui/vue';
import { Bars3Icon, BellIcon, XMarkIcon } from '@heroicons/vue/24/outline';
import LanguageSwitcher from './components/LanguageSwitcher.vue'; // 引入语言切换组件
import SideMenu from './components/SideMenu.vue'; // 引入菜单栏组件
import SearchModal from './components/SearchModal.vue'; // 引入搜索组件
import WechatQrcode from './components/WechatQrcode.vue';

// 导航栏数据
const navigation = [
  { name: '首页', href: '#', current: false },
  { name: 'Design', href: ' https://cliooz.cn/#/Design', current: false },
  { name: '帖子列表', href: ' https://cliooz.cn/#/PostList', current: false },
  { name: '关于', href: ' https://cliooz.cn/#/About', current: false },
];

// 在父组件中提供语言状态
const language = ref('en'); // 默认语言为英文
provide('language', language);

// 监听语言切换事件
onMounted(() => {
  window.addEventListener('language-change', (event) => {
    language.value = event.detail;
  });
});

/*<!--Start of Tawk.to Script-->*/
onMounted(() => {
  const script = document.createElement('script');
  script.type = 'text/javascript';
  script.async = true;
  script.src = 'https://embed.tawk.to/68ca4f953e09fe1922ac5c4c/1j5b4doq6';
  script.charset = 'UTF-8';
  script.setAttribute('crossorigin', '*');
  document.body.appendChild(script);
});
/*<!--End of Tawk.to Script-->*/

</script>

<style scoped>
/* 添加一些额外样式（如果需要） */
</style>