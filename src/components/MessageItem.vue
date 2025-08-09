<template>
  <div 
    class="p-5 transition-all bg-white border border-gray-200 review-item rounded-xl shadow-card hover:shadow-card-hover"
    :style="{ 'animation-delay': `${index * 0.05}s` }"
  >
    <!-- 用户信息 -->
    <div class="flex items-start gap-4 mb-4">
      <div class="relative">
        <img :src="review.attributes.avatar" class="w-12 h-12 border-2 rounded-full border-primary" alt="用户头像">
        <div v-if="review.attributes.isAdmin" class="absolute flex items-center justify-center w-5 h-5 text-xs text-white rounded-full -bottom-1 -right-1 bg-primary">
          <span class="text-xs">👑</span>
        </div>
      </div>
      <div class="flex-1 min-w-0">
        <div class="flex flex-wrap items-baseline gap-2">
          <div class="font-semibold truncate text-primary">
            {{ review.attributes.user || '匿名用户' }}
          </div>
          <div class="text-xs text-gray-500 whitespace-nowrap">
            {{ formatReviewDate(review.attributes.date) }}
          </div>
        </div>
        <div class="mt-1 flex flex-wrap gap-1.5">
          <span v-if="review.attributes.isAdmin" class="px-2 py-1 text-xs rounded-full bg-primary/10 text-primary">管理员</span>
          <span v-for="(tag, index) in review.attributes.tags" :key="index" class="px-2 py-1 text-xs rounded-full" 
                :class="{
                  'bg-blue-100 text-blue-800': tag === '热门',
                  'bg-amber-100 text-amber-800': tag === '官方',
                  'bg-emerald-100 text-emerald-800': tag === '推荐',
                  'bg-purple-100 text-purple-800': tag === '最新',
                  'bg-rose-100 text-rose-800': tag === '提问',
                  'bg-teal-100 text-teal-800': tag === '反馈'
                }">
            {{ tag }}
          </span>
        </div>
      </div>
    </div>
    
    <!-- 留言内容 -->
    <p class="mb-4 text-base text-gray-800 content-text">
      {{ review.attributes.content }}
    </p>
    
    <!-- 操作按钮 -->
    <div class="flex items-center justify-between">
      <button 
        @click="$emit('like', review.id)" 
        class="like-btn flex items-center gap-1.5 px-3.5 py-2 rounded-lg font-medium transition"
        :class="review.attributes.liked ? 'bg-red-100 text-red-600' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'"
      >
        <span>{{ review.attributes.liked ? '❤️' : '🤍' }}</span> 
        <span>{{ review.attributes.likes }} 赞</span>
      </button>
      
      <div class="flex gap-2">
        <button 
          @click="$emit('reply', review)" 
          class="p-2 text-gray-500 transition rounded-full hover:text-primary hover:bg-gray-100"
        >
          <span>↩️</span>
        </button>
        <button class="p-2 text-gray-500 transition rounded-full hover:text-amber-500 hover:bg-gray-100">
          <span>🚩</span>
        </button>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    review: {
      type: Object,
      required: true
    },
    index: {
      type: Number,
      default: 0
    }
  },
  methods: {
    formatReviewDate(dateString) {
      const date = new Date(dateString)
      const now = new Date()
      const diffInSeconds = Math.floor((now - date) / 1000)
      
      if (diffInSeconds < 60) {
        return "刚刚"
      }
      
      const diffInMinutes = Math.floor(diffInSeconds / 60)
      if (diffInMinutes < 60) {
        return `${diffInMinutes}分钟前`
      }
      
      const diffInHours = Math.floor(diffInMinutes / 60)
      if (diffInHours < 24) {
        return `${diffInHours}小时前`
      }
      
      const diffInDays = Math.floor(diffInHours / 24)
      if (diffInDays < 7) {
        return `${diffInDays}天前`
      }
      
      return date.toLocaleDateString('zh-CN', {
        month: '2-digit',
        day: '2-digit'
      })
    }
  }
}
</script>