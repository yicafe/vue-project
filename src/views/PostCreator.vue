<!-- PostCreator.vue 上传图片 + 发布文章-->待修改图片上传功能正常其他功能待修改
<template>
  <div class="max-w-md p-4 mx-auto space-y-4 bg-white rounded shadow">
    <h2 class="text-xl font-bold">发布文章</h2>
    
    <input
      v-model="title"
      type="text"
      placeholder="标题"
      class="w-full p-2 border rounded"
    />

    <textarea
      v-model="content"
      placeholder="内容"
      class="w-full h-32 p-2 border rounded"
    ></textarea>

    <input type="file" @change="handleFileChange" />

    <button
      @click="submitPost"
      class="px-4 py-2 text-white bg-blue-600 rounded hover:bg-blue-700"
    >
      发布
    </button>

    <div v-if="message" class="mt-2 text-green-600">{{ message }}</div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import axios from 'axios'

// 你的 Strapi 地址
//const API_URL = 'http://localhost:1337'
const API_URL = 'https://my-strapi-project-h7zt.onrender.com/'

// 可选：添加认证 token（如果需要登录）
const token = '' // 如果登录了，可以设置为 Bearer token

const title = ref('')
const content = ref('')
const file = ref(null)
const message = ref('')

const handleFileChange = (e) => {
  file.value = e.target.files[0]
}

const uploadImage = async () => {
  if (!file.value) return null

  const formData = new FormData()
  formData.append('files', file.value)

  const res = await axios.post(`${API_URL}/api/upload`, formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
      ...(token && { Authorization: `Bearer ${token}` })
    }
  })

  return res.data[0] // 返回上传后的图片对象
}

const submitPost = async () => {
  try {
    const image = await uploadImage()

    const postData = {
      data: {
        title: title.value,
        content: content.value,
        image: image?.id || null,
        publishedAt: new Date().toISOString(), // 自动发布
      }
    }

    const res = await axios.post(`${API_URL}/api/posts`, postData, {
      headers: {
        'Content-Type': 'application/json',
        ...(token && { Authorization: `Bearer ${token}` })
      }
    })

    message.value = '发布成功！🎉'
    console.log('创建的文章：', res.data)
    
    // 清空表单
    title.value = ''
    content.value = ''
    file.value = null
  } catch (err) {
    console.error('出错了：', err)
    message.value = '发布失败，请检查控制台'
  }
}
</script>

<style scoped>
/* 可根据项目风格自定义样式 */
</style>
