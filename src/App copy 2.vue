<template>
  <div class="#">
    <!-- 头部 -->
    <header class="fixed top-0 left-0 z-50 w-full bg-gray-900 shadow-md">
      <Disclosure as="nav" class="bg-pink-300" v-slot="{ open }">
        <div class="px-2 mx-auto max-w-7xl sm:px-6 lg:px-8">
          <div class="relative flex items-center justify-between h-16">
            <div class="absolute inset-y-0 left-0 flex items-center sm:hidden">
              <!-- Mobile menu button-->
              <DisclosureButton
                class="relative inline-flex items-center justify-center p-2 text-gray-400 rounded-md hover:bg-gray-700 hover:text-white focus:outline-none focus:ring-2 focus:ring-inset focus:ring-white">
                <span class="absolute -inset-0.5" />
                <span class="sr-only">Open main menu</span>
                <Bars3Icon v-if="!open" class="block size-6" aria-hidden="true" />
                <XMarkIcon v-else class="block size-6" aria-hidden="true" />
              </DisclosureButton>
            </div>
            <div class="flex items-center justify-center flex-1 sm:items-stretch sm:justify-start">
              <div class="flex items-center shrink-0">
                  <!--<img class="w-auto h-8" src="https://tailwindui.com/plus/img/logos/mark.svg?color=indigo&shade=500"-->
                  <img class="w-auto h-8" src="https://cliooz.com/logo.png?color=indigo&shade=500"
                  alt="Your Company" />
              </div>
              <div class="hidden sm:ml-6 sm:block">
                <div class="flex space-x-4">
                  <a v-for="item in navigation" :key="item.name" :href="item.href"
                    :class="[item.current ? 'bg-pink-400 text-gray-700' : 'text-gray-900 hover:bg-pink-400 hover:text-white', 'rounded-md px-3 py-2 text-sm font-medium']"
                    :aria-current="item.current ? 'page' : undefined">{{ item.name }}</a>
                </div>
              </div>
            </div>
            <div class="absolute inset-y-0 right-0 flex items-center pr-2 sm:static sm:inset-auto sm:ml-6 sm:pr-0">
              <button type="button"
                class="relative p-1 text-gray-400 bg-gray-800 rounded-full hover:text-white focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-gray-800">
                <span class="absolute -inset-1.5" />
                <span class="sr-only">View notifications</span>
                <BellIcon class="size-6" aria-hidden="true" />
              </button>

              <!-- Profile dropdown -->
              <Menu as="div" class="relative ml-3">
                <div>
                  <MenuButton
                    class="relative flex text-sm bg-gray-800 rounded-full focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-gray-800">
                    <span class="absolute -inset-1.5" />
                    <span class="sr-only">Open user menu</span>
                    <img class="rounded-full size-8"
                      src="https://images.unsplash.com/photo-1494790108377-be9c29b29330?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80"
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
                      :class="[active ? 'bg-gray-100 outline-none' : '', 'block px-4 py-2 text-sm text-gray-700']"><router-link to="Profile" class="text-blue-500 hover:text-blue-700">Your Profile</router-link></a>
                    </MenuItem>
                    <MenuItem v-slot="{ active }">
                    <a href="#"
                      :class="[active ? 'bg-gray-100 outline-none' : '', 'block px-4 py-2 text-sm text-gray-700']">Settings</a>
                    </MenuItem>
                    <MenuItem v-slot="{ active }">
                    <a href="#"
                      :class="[active ? 'bg-gray-100 outline-none' : '', 'block px-4 py-2 text-sm text-gray-700']">Sign
                      out</a>
                    </MenuItem>
                    <MenuItem v-slot="{ active }">
                    <a href="#"
                      :class="[active ? 'bg-gray-100 outline-none' : '', 'block px-4 py-2 text-sm text-gray-700']"><router-link to="login" class="text-blue-500 hover:text-blue-700">登录</router-link></a>
                    </MenuItem>
                  </MenuItems>
                </transition>
              </Menu>
            </div>
          </div>
        </div>

        <DisclosurePanel class="sm:hidden">
          <div class="px-2 pt-2 pb-3 space-y-1">
            <DisclosureButton v-for="item in navigation" :key="item.name" as="a" :href="item.href"
              :class="[item.current ? 'bg-gray-900 text-white' : 'text-gray-300 hover:bg-gray-700 hover:text-white', 'block rounded-md px-3 py-2 text-base font-medium']"
              :aria-current="item.current ? 'page' : undefined">{{ item.name }}</DisclosureButton>
          </div>
        </DisclosurePanel>
      </Disclosure>
    </header>

    <!-- 列表 -->
    <main class="flex-grow py-8">
      <router-view></router-view>
    </main>

    <!-- 底部 -->
    <footer class="#">
      <div class="container mx-auto text-center">
        <p>&copy; 2025 我的 cliooz 应用</p>
      </div>
    </footer>
  </div>
</template>

<script setup>
import { Disclosure, DisclosureButton, DisclosurePanel, Menu, MenuButton, MenuItem, MenuItems } from '@headlessui/vue'
import { Bars3Icon, BellIcon, XMarkIcon } from '@heroicons/vue/24/outline'

const navigation = [
  { name: 'Home', href: '#', current: false },
  { name: 'demo', href: 'http://localhost:5173/#/weibohubline', current: false },
  { name: 'PostList', href: 'https://cliooz.cn/#/PostList', current: false },
  { name: 'Calendar', href: 'https://vue-project-xi-five.vercel.app/#/PostList', current: false },
]
</script>


<style scoped>
/* 添加一些额外样式（如果需要） */
</style>
