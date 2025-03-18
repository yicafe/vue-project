<template>
  <!-- 快捷键提示 -->
  <div class="relative p-0 text-gray-900 bg-gray-300 rounded-full hover:bg-gray-200 " @click="openSearch">   <!--class="shortcut-hint改成 class="relative p-0 text-gray-900 bg-gray-300 rounded-full hover:bg-gray-200 ""-->
    <kbd>🔍</kbd>
  </div>

  <!-- 搜索模态框 -->
  <div v-if="isOpen" class="search-modal">
    <div class="modal-backdrop" @click.self="closeSearch" />
    
    <div class="modal-content">
      <div class="search-header">
        <div class="input-container">
          <input
            ref="searchInput"
            v-model="searchQuery"
            placeholder="搜索文档..."
            @keydown.up.prevent="selectPrev"
            @keydown.down.prevent="selectNext"
            @keydown.enter="selectCurrent"
          />
          <div class="shortcut-keys">
            <kbd>Esc</kbd>
          </div>
        </div>
      </div>

      <div v-if="results.length > 0" class="search-results">
        <div
          v-for="(result, index) in results"
          :key="result.id"
          class="result-item"
          :class="{ 'selected': selectedIndex === index }"
          @mouseover="selectedIndex = index"
          @click="navigateTo(result)"
        >
          <div class="result-category">{{ result.category }}</div>
          <div class="result-title" v-html="highlight(result.title)" />
          <div class="result-description" v-html="highlight(result.description)" />
        </div>
      </div>

      <div v-else-if="searchQuery && !isLoading" class="empty-state">
        没有找到 "<span class="query-text">{{ searchQuery }}</span>" 相关结果
      </div>

      <div v-if="isLoading" class="loading-state">
        <svg class="spinner" viewBox="0 0 50 50">
          <circle cx="25" cy="25" r="20" fill="none" stroke-width="5"></circle>
        </svg>
        正在搜索...
      </div>

      <div class="search-footer">
        <div class="navigation-hints">
          <span class="hint-item">
            <kbd>↑</kbd><kbd>↓</kbd> 导航
          </span>
          <span class="hint-item">
            <kbd>Enter</kbd> 确认
          </span>
          <span class="hint-item">
            <kbd>Esc</kbd> 关闭
          </span>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, watch, onMounted, onBeforeUnmount } from 'vue'
import { useRouter } from 'vue-router'

const router = useRouter()

// 状态管理
const isOpen = ref(false)
const searchQuery = ref('')
const selectedIndex = ref(-1)
const searchInput = ref(null)
const isLoading = ref(false)

// 模拟数据
const searchData = ref([
  { 
    id: 1,
    category: '学习',
    title: 'rhino enscape',
    description: '学习技巧分享',
    path: '/about'
  },
  {
    id: 2,
    category: '工具类',
    title: 'Flex 布局',
    description: '使用flexbox实现灵活布局',
    path: '/utilities/flex'
  },
  {
    id: 3,
    category: '社区',
    title: '社区公约',
    description: '需要注意的问题',
    path: '/shequgongyue'
  },
  // 更多数据...
])

// 计算属性
const results = computed(() => {
  if (!searchQuery.value) return []
  
  const query = searchQuery.value.toLowerCase()
  return searchData.value.filter(item => {
    return (
      item.title.toLowerCase().includes(query) ||
      item.description.toLowerCase().includes(query) ||
      item.category.toLowerCase().includes(query)
    )
  })
})

// 方法
const openSearch = () => {
  isOpen.value = true
  document.body.classList.add('no-scroll')
}

const closeSearch = () => {
  isOpen.value = false
  searchQuery.value = ''
  selectedIndex.value = -1
  document.body.classList.remove('no-scroll')
}

const highlight = (text) => {
  const query = searchQuery.value
  if (!query) return text
  return text.replace(
    new RegExp(query, 'gi'),
    match => `<span class="highlight">${match}</span>`
  )
}

const selectPrev = () => {
  selectedIndex.value = Math.max(0, selectedIndex.value - 1)
}

const selectNext = () => {
  selectedIndex.value = Math.min(results.value.length - 1, selectedIndex.value + 1)
}

const selectCurrent = () => {
  if (results.value[selectedIndex.value]) {
    navigateTo(results.value[selectedIndex.value])
  }
}

const navigateTo = (result) => {
  router.push(result.path)
  closeSearch()
}

// 键盘事件处理
const handleKeydown = (e) => {
  if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'k') {
    e.preventDefault()
    isOpen.value ? closeSearch() : openSearch()
  }
  
  if (e.key === 'Escape' && isOpen.value) {
    closeSearch()
  }
}

// 生命周期
onMounted(() => {
  window.addEventListener('keydown', handleKeydown)
})

onBeforeUnmount(() => {
  window.removeEventListener('keydown', handleKeydown)
})

// 自动聚焦
watch(isOpen, (val) => {
  if (val) {
    setTimeout(() => {
      searchInput.value?.focus()
    }, 50)
  }
})
</script>

<style scoped>
/* 快捷键提示 */
.shortcut-hint {
  position: fixed;
  top: 1.25rem;
  left: 3.25rem;
  padding: 0rem 0rem;
  background: #fff;
  border: 1px solid #e5e7eb;
  border-radius: 1.75rem;
  cursor: pointer;
  display: inline-flex;
  gap: 0.375rem;
  align-items: center;
  font-size: 0.75rem;
  color: #475569;
}

.shortcut-hint:hover {
  background: #fff;
  box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);
}

kbd {
  padding: 0.15rem 0.4rem;
  background: #f3f4f6;
  border: 1px solid #e5e7eb;
  border-radius: 0.75rem;
  font-family: monospace;
  font-size: 0.775rem;
}

/* 模态框 */
.search-modal {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  z-index: 999;
}

.modal-backdrop {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.5);
  backdrop-filter: blur(4px);
}

.modal-content {
  position: relative;
  max-width: 42rem;
  margin: 10vh auto 0;
  background: white;
  border-radius: 0.75rem;
  box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.25);
}

/* 搜索输入框 */
.input-container {
  position: relative;
  padding: 1.5rem;
}

input {
  width: 100%;
  padding: 1rem 1.5rem;
  border: 2px solid #e5e7eb;
  border-radius: 0.5rem;
  font-size: 1rem;
  transition: border-color 0.2s;
}

input:focus {
  outline: none;
  border-color: #3b82f6;
}

.shortcut-keys {
  position: absolute;
  right: 2rem;
  top: 50%;
  transform: translateY(-50%);
}

/* 搜索结果 */
.search-results {
  max-height: 60vh;
  overflow-y: auto;
  padding: 0 1.5rem 1.5rem;
}

.result-item {
  padding: 1rem;
  border-radius: 0.5rem;
  cursor: pointer;
  transition: background 0.2s;
}

.result-item:hover,
.result-item.selected {
  background: #f8fafc;
}

.result-category {
  font-size: 0.75rem;
  color: #64748b;
  text-transform: uppercase;
  letter-spacing: 0.05em;
  margin-bottom: 0.25rem;
}

.result-title {
  font-weight: 600;
  color: #1e293b;
}

.result-description {
  font-size: 0.875rem;
  color: #64748b;
  margin-top: 0.25rem;
}

.highlight {
  background-color: #fde047;
  border-radius: 0.25rem;
  padding: 0 0.125rem;
}

/* 加载状态 */
.loading-state {
  padding: 2rem;
  text-align: center;
  color: #64748b;
}

.spinner {
  animation: rotate 2s linear infinite;
  width: 1.5rem;
  height: 1.5rem;
  margin-right: 0.5rem;
}

.spinner circle {
  stroke: #3b82f6;
  stroke-linecap: round;
  animation: dash 1.5s ease-in-out infinite;
}

@keyframes rotate {
  100% { transform: rotate(360deg); }
}

@keyframes dash {
  0% { stroke-dasharray: 1, 150; stroke-dashoffset: 0; }
  50% { stroke-dasharray: 90, 150; stroke-dashoffset: -35; }
  100% { stroke-dasharray: 90, 150; stroke-dashoffset: -124; }
}

/* 空状态 */
.empty-state {
  padding: 2rem;
  text-align: center;
  color: #64748b;
}

.query-text {
  font-weight: 600;
  color: #1e293b;
}

/* 底部提示 */
.search-footer {
  border-top: 1px solid #f1f5f9;
  padding: 1rem 1.5rem;
}

.navigation-hints {
  display: flex;
  gap: 1.5rem;
  justify-content: center;
}

.hint-item {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  color: #64748b;
  font-size: 0.875rem;
}

/* 全局滚动锁定 */
.no-scroll {
  overflow: hidden;
}
</style>