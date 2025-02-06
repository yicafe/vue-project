<template>
  <div class="relative overflow-hidden ">
    <!-- 头部 -->
    <header class="text-center">
      <h1 class="text-4xl font-bold text-gray-900">
        {{ language === 'en' ? 'About Me' : '关于我' }}
      </h1>
      <p class="mt-4 text-lg text-gray-600">
        {{ language === 'en' ? 'Welcome to my personal website and learning platform!' : '欢迎来到我的个人网站和学习平台！' }}
      </p>
    </header>

    <!-- 主要内容 -->
    <main class="max-w-4xl mx-auto mt-12">
      <!-- 个人介绍 -->
      <section class="mb-12">
        <h2 class="text-2xl font-semibold text-gray-800">
          {{ language === 'en' ? 'Who Am I?' : '我是谁？' }}
        </h2>
        <p class="mt-4 leading-relaxed text-gray-600">
          {{
            language === 'en'
              ? 'I am a passionate designer and developer with a focus on 3D modeling, rendering, and web development. This website serves as a platform to share my knowledge, projects, and experiences with tools like Rhino, Enscape, Vue 3, and Tailwind CSS.'
              : '我是一名热衷于设计和开发的设计师，专注于3D建模、渲染和Web开发。这个网站是我分享知识、项目和经验的平台，涉及的工具包括Rhino、Enscape、Vue 3和Tailwind CSS。'
          }}
        </p>
      </section>

      <!-- 学习分享 -->
      <section class="mb-12">
        <h2 class="text-2xl font-semibold text-gray-800">
          {{ language === 'en' ? 'Learning & Sharing' : '学习与分享' }}
        </h2>
        <p class="mt-4 leading-relaxed text-gray-600">
          {{
            language === 'en'
              ? "On this website, you'll find tutorials, tips, and resources related to 3D modeling, rendering, and web development. Whether you're a beginner or an experienced professional, there's something here for everyone."
              : '在这个网站上，你可以找到与3D建模、渲染和Web开发相关的教程、技巧和资源。无论你是初学者还是经验丰富的专业人士，这里都有适合你的内容。'
          }}
        </p>
      </section>

      <!-- Rhino & Enscape 图文分享 -->
      <section class="mb-12">
        <h2 class="text-2xl font-semibold text-gray-800">
          {{ language === 'en' ? 'Rhino & Enscape' : 'Rhino 和 Enscape' }}
        </h2>
        <div class="grid grid-cols-1 gap-6 mt-6 md:grid-cols-2">
          <div class="p-6 bg-white rounded-lg shadow-md">
            <img src="https://i.postimg.cc/FsX2KqSN/14-augustlosangeles.jpg" alt="Rhino Example" class="object-cover w-full h-48 rounded-md">
            <h3 class="mt-4 text-xl font-semibold text-gray-800">
              {{ language === 'en' ? 'Rhino 3D Modeling' : 'Rhino 3D 建模' }}
            </h3>
            <p class="mt-2 text-gray-600">
              {{
                language === 'en'
                  ? 'Rhino is a powerful 3D modeling tool used in architecture, design, and engineering. Here, I share my projects and tips for mastering Rhino.'
                  : 'Rhino 是一款强大的3D建模工具，广泛应用于建筑、设计和工程领域。在这里，我分享我的项目和掌握Rhino的技巧。'
              }}
            </p>
          </div>
          <div class="p-6 bg-white rounded-lg shadow-md">
            <img src="https://i.postimg.cc/FsX2KqSN/14-augustlosangeles.jpg" alt="Enscape Example" class="object-cover w-full h-48 rounded-md">
            <h3 class="mt-4 text-xl font-semibold text-gray-800">
              {{ language === 'en' ? 'Enscape Rendering' : 'Enscape 渲染' }}
            </h3>
            <p class="mt-2 text-gray-600">
              {{
                language === 'en'
                  ? 'Enscape is a real-time rendering plugin that brings your Rhino models to life. Explore my renders and learn how to create stunning visuals.'
                  : 'Enscape 是一款实时渲染插件，可以让你的Rhino模型栩栩如生。在这里，你可以欣赏我的渲染作品，并学习如何创建令人惊叹的视觉效果。'
              }}
            </p>
          </div>
        </div>
      </section>

      <!-- 技术栈 -->
      <section>
        <h2 class="text-2xl font-semibold text-gray-800">
          {{ language === 'en' ? 'Tech Stack' : '技术栈' }}
        </h2>
        <p class="mt-4 leading-relaxed text-gray-600">
          {{
            language === 'en'
              ? 'This website is built using Vue 3 for the frontend framework and Tailwind CSS for styling. These tools allow me to create a fast, responsive, and modern user experience.'
              : '本网站使用 Vue 3 作为前端框架，并使用 Tailwind CSS 进行样式设计。这些工具使我能够创建快速、响应式且现代化的用户体验。'
          }}
        </p>
      </section>
    </main>

  </div>
</template>

<script>
import { inject } from 'vue';

export default {
  name: 'AboutPage',
  setup() {
    // 注入全局语言状态
    const language = inject('language');

    return {
      language,
    };
  },
};
</script>

<style scoped>
/* 如果需要自定义样式，可以在这里添加 */
</style>