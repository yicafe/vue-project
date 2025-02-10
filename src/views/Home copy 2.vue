<template>
  <div class="relative overflow-hidden ">
    <div class="pt-16 pb-80 sm:pb-40 sm:pt-24 lg:pb-48 lg:pt-40">
      <div class="relative px-4 mx-auto max-w-7xl sm:static sm:px-6 lg:px-8">
        <div class="sm:max-w-lg">
          <img alt="Vue logo" class="logo" src="https://cliooz.com/logo.png" width="125" height="125" />
          <h1 class="text-4xl font-bold tracking-tight text-gray-900 sm:text-6xl">
            {{ language === 'en' ? 'Hi, Finally meet you.' : '嗨，终于见到你了。' }}
          </h1>
          <p class="mt-4 text-xl text-gray-600">
            {{ language === 'en' ? 'Time is like the water in a sponge. You will have it while you squeeze. - Lu Xun' : '时间就像海绵里的水，只要你愿意挤，总还有的。--鲁迅' }}
          </p>
        </div>
        <div>
          <div class="mt-10">
            <!-- Decorative image grid -->
            <div aria-hidden="true"
              class="pointer-events-none lg:absolute lg:inset-y-0 lg:mx-auto lg:w-full lg:max-w-7xl">
              <div
                class="absolute transform sm:left-1/2 sm:top-0 sm:translate-x-8 lg:left-1/2 lg:top-1/2 lg:-translate-y-1/2 lg:translate-x-8">
                <div class="flex items-center space-x-6 lg:space-x-8">
                  <div class="transform scale-100 -rotate-6">
                    <div class="h-64 overflow-hidden rounded-lg w-44">
                      <img src="https://i.postimg.cc/YCpZ6W8P/3-akizuki-namida.jpg" 
                      alt="" class="object-cover size-full" />
                    </div>
                    <div class="h-64 overflow-hidden rounded-lg w-44 sm:opacity-0 lg:opacity-100">
                      <!--3d modelcode-->
                      <ModelViewer
                        model-url="../models3dgltf/model1.glb"
                        :auto-rotate="true"
                        :scale="0.8"
                        background-color="#"
                        @loaded="handleModelLoaded"
                        @error="handleModelError"
                      alt="" class="object-cover size-full" />
                    </div>
                  </div>
                  <div class="grid grid-cols-1 shrink-0 gap-y-6 lg:gap-y-8">
                    <div class="h-64 overflow-hidden rounded-lg w-44">
                      <img src="https://i.postimg.cc/N0Zdz97B/29-giovanni-previdi-2.jpg"
                        alt="" class="object-cover size-full" />
                    </div>
                    <div class="h-64 overflow-hidden rounded-lg w-44">
                      <img src="https://i.postimg.cc/4xskWM4B/4-snow-shower.jpg"
                        alt="" class="object-cover size-full" />
                    </div>
                    <div class="h-64 overflow-hidden rounded-lg w-44">
                      <img src="https://i.postimg.cc/KYp6v8PH/26-pistachiosjewelry.jpg"
                        alt="" class="object-cover size-full" />
                    </div>
                  </div>
                  <div class="grid grid-cols-1 shrink-0 gap-y-6 lg:gap-y-8">
                    <div class="h-64 overflow-hidden rounded-lg w-44">
                      <img src="https://i.postimg.cc/6p5b2NpJ/10-jannerugland.jpg"
                        alt="" class="object-cover size-full" />
                    </div>
                    <div class="h-64 overflow-hidden rounded-lg w-44">
                      <img src="https://i.postimg.cc/rskQqBPH/15ellemaywatson.jpg"
                        alt="" class="object-cover size-full" />
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <a href="#"
              class="inline-block px-8 py-3 font-medium text-center text-white border border-transparent rounded-md bg-violet-400 hover:bg-violet-500">
              {{ language === 'en' ? '🍒🦭' : '🦭🍒' }}
            </a>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { inject } from 'vue';

//3dmodel 显示代码（
import ModelViewer from '../components/ModelViewer.vue'

const handleModelLoaded = (model) => {
  console.log('Model loaded:', model)
}

const handleModelError = (error) => {
  console.error('Model load error:', error)
}
//3dmodel 显示代码）

// 注入全局语言状态
const language = inject('language');

// 切换语言的方法
const toggleLanguage = () => {
  language.value = language.value === 'en' ? 'zh' : 'en';
};
</script>

<style scoped>
/* 添加一些额外样式（如果需要） */

/*3dmodel style*/
.container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 20px;
}

</style>