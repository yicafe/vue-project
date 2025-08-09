<template>
  <div class="flex items-center justify-center min-h-screen p-4 md:p-6">
    <div class="w-full max-w-6xl bg-black rounded-2xl shadow-xl overflow-hidden flex flex-col min-h-[90vh]">
      <!-- 头部 -->
      <header class="px-4 py-6 text-center text-white bg-gradient-to-r from-primary to-primary-dark md:py-8 md:px-8">
        <div class="max-w-4xl mx-auto">
          <div class="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
            <div>
              <h1 class="flex items-center justify-center gap-3 text-2xl font-bold md:text-3xl md:justify-start">
                <span class="text-2xl">💬</span>
                <span>Vue.js + Tailwind CSS留言板系统</span>
              </h1>
              <p class="mt-2 text-sm opacity-90 md:text-base">
                基于Vue.js、Tailwind CSS和Strapi 5的现代化留言板
              </p>
            </div>
            
            <div class="flex flex-wrap justify-center gap-3">
              <div class="tech-badge flex items-center gap-2 bg-white/15 py-1.5 px-3 rounded-full text-xs md:text-sm backdrop-blur-sm">
                <span class="font-bold">Vue.js</span>
              </div>
              <div class="tech-badge flex items-center gap-2 bg-white/15 py-1.5 px-3 rounded-full text-xs md:text-sm backdrop-blur-sm">
                <span class="font-bold">Tailwind CSS</span>
              </div>
              <div class="tech-badge flex items-center gap-2 bg-white/15 py-1.5 px-3 rounded-full text-xs md:text-sm backdrop-blur-sm">
                <span class="font-bold">Strapi 5</span>
              </div>
            </div>
          </div>
        </div>
      </header>
      
      <!-- 主内容区 -->
      <div class="grid flex-1 grid-cols-1 gap-0 lg:grid-cols-2">
        <!-- 留言表单区 -->
        <div class="flex flex-col p-5 border-r-0 border-gray-200 bg-gray-50 md:p-7 lg:border-r">
          <div class="flex items-center gap-3 mb-6">
            <div class="flex items-center justify-center w-10 h-10 rounded-full bg-primary">
              <span class="text-lg text-white">📝</span>
            </div>
            <h2 class="text-xl font-semibold text-gray-800">发表留言</h2>
          </div>
          
          <div class="flex flex-col flex-1">
            <div class="mb-5">
              <label class="block mb-2 font-medium text-gray-700">您的名称</label>
              <input 
                v-model="newReview.user" 
                placeholder="输入您的名称（可选）"
                class="w-full p-3.5 border border-gray-300 rounded-lg text-base transition focus:outline-none focus:ring-2 focus:ring-primary/50 bg-white"
              >
            </div>
            
            <div class="mb-5">
              <label class="block mb-2 font-medium text-gray-700">留言内容</label>
              <textarea 
                v-model="newReview.content" 
                placeholder="请在此处输入您的留言..."
                maxlength="500"
                @input="updateCharacterCount"
                class="w-full p-3.5 border border-gray-300 rounded-lg text-base transition focus:outline-none focus:ring-2 focus:ring-primary/50 bg-white min-h-[150px] resize-y"
              ></textarea>
              <div class="mt-1 text-sm text-right" :class="{
                'text-gray-500': characterCount <= 400, 
                'text-amber-500': characterCount > 400 && characterCount <= 500,
                'text-red-500': characterCount > 500
              }">
                {{ characterCount }}/500
              </div>
            </div>
            
            <div class="mb-5">
              <label class="block mb-2 font-medium text-gray-700">选择标签</label>
              <div class="flex flex-wrap gap-2">
                <button 
                  v-for="tag in availableTags" 
                  :key="tag"
                  @click="toggleTag(tag)"
                  class="px-3 py-1.5 rounded-full text-sm transition"
                  :class="{
                    'bg-blue-100 text-blue-800 border border-blue-300': newReview.tags.includes(tag),
                    'bg-gray-100 text-gray-700 hover:bg-gray-200': !newReview.tags.includes(tag)
                  }"
                >
                  {{ tag }}
                </button>
              </div>
            </div>
            
            <button 
              class="mt-auto bg-gradient-to-r from-primary to-primary-dark text-white py-3.5 px-6 rounded-lg text-base font-semibold cursor-pointer transition flex items-center justify-center gap-3 hover:shadow-button disabled:opacity-70 disabled:cursor-not-allowed disabled:shadow-none"
              @click="submitReview"
              :disabled="isSubmitting || characterCount === 0 || characterCount > 500"
            >
              <span>📤</span>
              <span>{{ isSubmitting ? '提交中...' : '提交留言' }}</span>
            </button>
          </div>
        </div>
        
        <!-- 留言列表区 -->
        <div class="flex flex-col p-5 bg-white md:p-7">
          <div class="flex items-center gap-3 mb-6">
            <div class="flex items-center justify-center w-10 h-10 rounded-full bg-amber-500">
              <span class="text-lg text-white">📋</span>
            </div>
            <h2 class="text-xl font-semibold text-gray-800">留言列表</h2>
            <div class="flex gap-2 ml-auto">
              <div class="px-3 py-1 text-sm rounded-full bg-primary/10 text-primary">
                {{ reviews.length }} 条留言
              </div>
              <select 
                v-model="sortBy" 
                class="px-3 py-1 text-sm text-gray-700 bg-gray-100 border border-gray-300 rounded-full focus:outline-none"
              >
                <option value="newest">最新优先</option>
                <option value="oldest">最早优先</option>
                <option value="popular">最受欢迎</option>
              </select>
            </div>
          </div>
          
          <div class="flex flex-col flex-1 gap-5 pr-2 overflow-y-auto scrollbar-custom">
            <!-- 留言项 -->
            <MessageItem
              v-for="(review, index) in sortedReviews"
              :key="review.id"
              :review="review"
              :index="index"
              @like="likeReview"
              @reply="replyToReview"
            />
            
            <!-- 空状态 -->
            <div class="flex flex-col items-center justify-center py-10 text-center text-gray-500 empty-message" v-if="!isLoading && reviews.length === 0">
              <span class="mb-4 text-5xl opacity-30">📭</span>
              <h3 class="mb-1 text-lg font-medium text-gray-600">暂无留言</h3>
              <p class="text-sm">成为第一个留言的人吧！</p>
            </div>
            
            <!-- 加载状态 -->
            <div class="flex justify-center py-8 loading-indicator" v-if="isLoading">
              <div class="w-10 h-10 border-gray-200 rounded-full spinner border-3 border-t-primary animate-spin"></div>
            </div>
          </div>
          
          <!-- 系统状态 -->
          <div class="pt-4 mt-5 text-sm text-center text-gray-500 border-t border-gray-200">
            <div class="flex flex-wrap items-center justify-center gap-2">
              <span class="w-2.5 h-2.5 rounded-full bg-green-500 animate-pulse"></span>
              <span>系统运行正常</span>
              <span>•</span>
              <span>{{ new Date().toLocaleDateString() }}</span>
              <span>•</span>
              <span>后端: {{ strapiStatus }}</span>
            </div>
          </div>
        </div>
      </div>
      
      <!-- 通知 -->
      <div class="fixed flex items-center gap-3 px-5 py-3 font-medium text-gray-800 -translate-x-1/2 bg-white border-l-4 border-green-500 rounded-lg opacity-0 notification bottom-5 left-1/2 shadow-notification"
          :class="{ 'opacity-100': showNotification }">
        <span v-if="notificationIcon === 'success'" class="text-green-500">✅</span>
        <span v-else-if="notificationIcon === 'error'" class="text-red-500">❌</span>
        <span v-else-if="notificationIcon === 'warning'" class="text-amber-500">⚠️</span>
        <span v-else class="text-blue-500">ℹ️</span>
        <span>{{ notificationMessage }}</span>
      </div>
    </div>
  </div>
</template>

<script>
import { ref, onMounted, computed } from 'vue'
import MessageItem from '../components/MessageItem.vue'

// Strapi配置 - 替换为您的实际Strapi服务器地址
const STRAPI_URL = 'https://my-strapi-project-h7zt.onrender.com'

export default {
  components: {
    MessageItem
  },
  setup() {
    // 留言数据
    const reviews = ref([])
    const isLoading = ref(true)
    const isSubmitting = ref(false)
    const sortBy = ref('newest')
    const strapiStatus = ref('未连接')
    
    // 新留言
    const newReview = ref({
      content: '',
      user: '',
      avatar: `https://i.pravatar.cc/150?img=${Math.floor(Math.random() * 70)}`,
      likes: 0,
      date: new Date(),
      tags: [],
      isAdmin: false
    })
    
    // 可用标签
    const availableTags = ref([
      '热门', '官方', '推荐', '最新', '提问', '反馈'
    ])
    
    // 字符计数
    const characterCount = ref(0)
    
    // 通知系统
    const showNotification = ref(false)
    const notificationMessage = ref('')
    const notificationIcon = ref('info')
    
    // 排序后的留言
const sortedReviews = computed(() => {
  const sorted = [...reviews.value]
  
  switch(sortBy.value) {
    case 'newest':
      return sorted.sort((a, b) => {
        return new Date(b.attributes.date) - new Date(a.attributes.date)
      })
    case 'oldest':
      return sorted.sort((a, b) => {
        return new Date(a.attributes.date) - new Date(b.attributes.date)
      })
    case 'popular':
      return sorted.sort((a, b) => {
        return b.attributes.likes - a.attributes.likes
      })
    default:
      return sorted
  }
})
    
    // 获取留言列表
    const fetchReviews = async () => {
      try {
        isLoading.value = true
        
        // 检查Strapi连接状态
        try {
          const statusResponse = await fetch(`${STRAPI_URL}/_health`)
          strapiStatus.value = statusResponse.ok ? '已连接' : '连接失败'
        } catch {
          strapiStatus.value = '连接失败'
        }
        
        // 从Strapi获取数据
        const response = await fetch(`${STRAPI_URL}/api/reviews?populate=*`)
        const data = await response.json()
        
        if (data && data.data) {
          reviews.value = data.data.map(item => ({
            id: item.id,
            attributes: {
              ...item.attributes,
              date: new Date(item.attributes.date)
            }
          }))
        } else {
          throw new Error('未获取到留言数据')
        }
      } catch (error) {
        console.error('获取留言失败:', error)
        showNotificationMessage('无法加载留言，使用模拟数据', 'error')
        // 回退到模拟数据
        reviews.value = getMockReviews()
      } finally {
        isLoading.value = false
      }
    }
    
    // 提交留言
    const submitReview = async () => {
      if (!newReview.value.content.trim()) {
        showNotificationMessage('留言内容不能为空', 'error')
        return
      }
      
      if (newReview.value.content.length > 500) {
        showNotificationMessage('留言内容不能超过500字', 'error')
        return
      }
      
      try {
        isSubmitting.value = true
        
        // 创建新留言数据
        const reviewData = {
          user: newReview.value.user || '匿名用户',
          content: newReview.value.content,
          avatar: newReview.value.avatar,
          date: new Date().toISOString(),
          likes: 0,
          liked: false,
          tags: [...newReview.value.tags],
          isAdmin: Math.random() < 0.2
        }
        
        // 发送到Strapi
        const response = await fetch(`${STRAPI_URL}/api/reviews`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            data: reviewData
          })
        })
        
        const result = await response.json()
        
        // 添加到留言列表开头
        reviews.value.unshift({
          id: result.data.id,
          attributes: {
            ...reviewData,
            date: new Date(reviewData.date)
          }
        })
        
        // 显示成功通知
        showNotificationMessage('留言提交成功！', 'success')
        
        // 清空表单
        newReview.value.content = ''
        newReview.value.user = ''
        newReview.value.tags = []
        characterCount.value = 0
        
        // 随机生成新头像
        newReview.value.avatar = `https://i.pravatar.cc/150?img=${Math.floor(Math.random() * 70)}`
      } catch (error) {
        console.error('提交留言失败:', error)
        showNotificationMessage('留言提交失败，请稍后再试', 'error')
      } finally {
        isSubmitting.value = false
      }
    }
    
    // 点赞留言
    const likeReview = async (id) => {
      try {
        // 查找当前留言
        const review = reviews.value.find(r => r.id === id)
        if (!review) return
        
        const newLikes = review.attributes.liked 
          ? review.attributes.likes - 1
          : review.attributes.likes + 1
          
        const newLikedStatus = !review.attributes.liked
        
        // 更新Strapi
        await fetch(`${STRAPI_URL}/api/reviews/${id}`, {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            data: {
              likes: newLikes,
              liked: newLikedStatus
            }
          })
        })
        
        // 更新本地状态
        review.attributes.likes = newLikes
        review.attributes.liked = newLikedStatus
        
        showNotificationMessage(
          newLikedStatus ? '已点赞！' : '已取消点赞',
          'success'
        )
      } catch (error) {
        console.error('点赞操作失败:', error)
        showNotificationMessage('操作失败，请稍后再试', 'error')
      }
    }
    
    // 回复留言
    const replyToReview = (review) => {
      newReview.value.content = `@${review.attributes.user || '匿名用户'} `
      updateCharacterCount()
      
      // 滚动到表单区
      document.querySelector('textarea').focus()
      
      showNotificationMessage('已开始回复该留言', 'info')
    }
    
    // 切换标签
    const toggleTag = (tag) => {
      const index = newReview.value.tags.indexOf(tag)
      if (index > -1) {
        newReview.value.tags.splice(index, 1)
      } else {
        if (newReview.value.tags.length < 3) {
          newReview.value.tags.push(tag)
        } else {
          showNotificationMessage('最多只能选择3个标签', 'warning')
        }
      }
    }
    
    // 格式化日期
    const formatReviewDate = (dateString) => {
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
    
    // 显示通知
    const showNotificationMessage = (message, type = 'success') => {
      notificationMessage.value = message
      notificationIcon.value = type
      
      showNotification.value = true
      setTimeout(() => {
        showNotification.value = false
      }, 3000)
    }
    
    // 更新字符计数
    const updateCharacterCount = () => {
      characterCount.value = newReview.value.content.length
    }
    
    // 模拟数据（备用）
    const getMockReviews = () => {
      return [
        {
          id: "1",
          attributes: {
            content: "这个留言板设计得非常棒！界面简洁美观，功能也很实用。点赞功能非常直观，让我可以轻松表达对其他留言的喜爱。",
            user: "张三",
            avatar: "https://i.pravatar.cc/150?img=11",
            date: new Date(Date.now() - 86400000 * 2),
            likes: 12,
            liked: false,
            tags: ["热门", "官方"],
            isAdmin: true
          }
        },
        {
          id: "2",
          attributes: {
            content: "使用体验很好，点赞功能很流畅。希望未来能增加回复功能，这样我们可以更好地进行讨论和交流。",
            user: "李四",
            avatar: "https://i.pravatar.cc/150?img=22",
            date: new Date(Date.now() - 3600000 * 5),
            likes: 8,
            liked: true,
            tags: ["推荐"]
          }
        },
        {
          id: "3",
          attributes: {
            content: "感谢创建这个留言板，让我可以分享我的想法并与他人交流。界面设计简洁明了，使用起来非常方便。",
            user: "王五",
            avatar: "https://i.pravatar.cc/150?img=33",
            date: new Date(Date.now() - 86400000),
            likes: 5,
            liked: false,
            tags: ["最新", "反馈"]
          }
        },
        {
          id: "4",
          attributes: {
            content: "请问如何自定义头像？我想上传自己的照片而不是使用随机生成的图片。",
            user: "赵六",
            avatar: "https://i.pravatar.cc/150?img=44",
            date: new Date(Date.now() - 3600000 * 10),
            likes: 3,
            liked: false,
            tags: ["提问"]
          }
        },
        {
          id: "5",
          attributes: {
            content: "建议增加留言搜索功能，当留言数量很多时，可以快速找到特定主题的内容。",
            user: "孙七",
            avatar: "https://i.pravatar.cc/150?img=55",
            date: new Date(Date.now() - 3600000 * 2),
            likes: 7,
            liked: true,
            tags: ["反馈", "推荐"]
          }
        }
      ]
    }
    
    // 组件挂载时获取留言
    onMounted(() => {
      fetchReviews()
    })
    
    return {
      reviews,
      sortedReviews,
      sortBy,
      newReview,
      availableTags,
      isLoading,
      isSubmitting,
      strapiStatus,
      showNotification,
      notificationMessage,
      notificationIcon,
      characterCount,
      fetchReviews,
      submitReview,
      likeReview,
      replyToReview,
      toggleTag,
      formatReviewDate,
      updateCharacterCount
    }
  }
}
</script>