<template>
  <div class="memory-viewer">
    <!-- 页面标题和控制区域 -->
    <div class="header">
      <h1 class="title">
        <el-icon class="title-icon"><Memo /></el-icon>
        {{ props.title }}
      </h1>
      <MemoryControls
        :is-connected="isConnected"
        :stats-visible="statsVisible"
        :auto-scroll-enabled="manualAutoScrollEnabled"
        @toggle-connection="toggleConnection"
        @query-memory="handleQueryMemory"
        @add-memory="handleAddMemory"
        @clear-memories="clearMemories"
        @toggle-stats="toggleStats"
        @toggle-auto-scroll="toggleAutoScroll"
      />
    </div>

    <!-- 筛选器和搜索 -->
    <div class="filters">
      <div class="filter-container">
        <!-- 记忆类型筛选 -->
        <div class="filter-item">
          <label class="filter-label">类型：</label>
          <el-select
            v-model="displaySelectedTypes"
            multiple
            collapse-tags-tooltip
            placeholder="选择记忆类型"
            size="small"
            @change="handleTypeChange"
          >
            <template #header>
              <el-button text size="small" @click="toggleAllTypes" class="select-all-option">
                {{ isAllTypesSelected ? '取消全选' : '全选' }}
              </el-button>
            </template>
            <el-option
              v-for="type in availableTypes"
              :key="type"
              :label="getTypeLabel(type)"
              :value="type"
            >
              <span class="type-option" :class="`type-${type}`">
                {{ getTypeLabel(type) }}
              </span>
            </el-option>
          </el-select>
        </div>

        <!-- 重要性筛选 -->
        <div class="filter-item">
          <label class="filter-label">重要性：</label>
          <el-select
            v-model="displaySelectedImportance"
            multiple
            collapse-tags-tooltip
            placeholder="选择重要性"
            size="small"
            @change="handleImportanceChange"
          >
            <template #header>
              <el-button text size="small" @click="toggleAllImportance" class="select-all-option">
                {{ isAllImportanceSelected ? '取消全选' : '全选' }}
              </el-button>
            </template>
            <el-option
              v-for="importance in availableImportance"
              :key="importance"
              :label="getImportanceLabel(importance)"
              :value="importance"
            >
              <span class="importance-option" :class="`importance-${importance}`">
                {{ getImportanceLabel(importance) }}
              </span>
            </el-option>
          </el-select>
        </div>

        <!-- 搜索区域 -->
        <div class="search-section">
          <el-input
            v-model="searchQuery"
            placeholder="搜索记忆内容..."
            class="search-input"
            size="small"
            clearable
          >
            <template #prefix>
              <el-icon><Search /></el-icon>
            </template>
          </el-input>

          <div class="search-stats" v-if="searchQuery">{{ searchMatchCount }} 条</div>
        </div>
      </div>
    </div>

    <!-- 统计面板 -->
    <MemoryStats
      :visible="statsVisible"
      :type-stats="typeStats"
      :importance-stats="importanceStats"
      :total-memories="memories.length"
      :memories="memories.map((m) => ({ timestamp: m.timestamp, memoryType: m.memoryType }))"
    />

    <!-- 记忆显示区域 -->
    <div class="memories-container" ref="memoriesContainer" @scroll="handleScroll">
      <!-- 导航按钮 -->
      <div class="navigation-buttons" v-if="filteredMemories.length > 10">
        <el-button
          type="primary"
          size="small"
          circle
          @click="scrollToTop"
          class="nav-btn"
          title="回到顶部"
        >
          <el-icon><ArrowUp /></el-icon>
        </el-button>

        <el-button
          type="primary"
          size="small"
          circle
          @click="scrollToBottom"
          class="nav-btn"
          title="回到底部"
        >
          <el-icon><ArrowDown /></el-icon>
        </el-button>
      </div>

      <MemoryEntry
        v-for="(memory, index) in filteredMemories"
        :key="memory.id"
        :memory="memory"
        :line-number="index + 1"
        :expanded="expandedMemories[index] !== false"
        @toggle-expand="toggleExpand(index)"
        @view-detail="handleViewDetail(memory)"
        @delete="handleDelete(memory)"
      />

      <div v-if="filteredMemories.length === 0" class="no-memories">
        <el-empty description="暂无记忆数据" />
      </div>
    </div>

    <!-- 记忆详情对话框 -->
    <el-dialog v-model="detailDialogVisible" title="记忆详情" width="700px">
      <div v-if="currentMemory" class="memory-detail">
        <el-descriptions :column="2" border>
          <el-descriptions-item label="ID">{{ currentMemory.id }}</el-descriptions-item>
          <el-descriptions-item label="类型">{{
            getTypeLabel(currentMemory.memoryType)
          }}</el-descriptions-item>
          <el-descriptions-item label="重要性">{{
            getImportanceLabel(currentMemory.importance)
          }}</el-descriptions-item>
          <el-descriptions-item label="时间">{{
            formatTimestamp(currentMemory.timestamp)
          }}</el-descriptions-item>
          <el-descriptions-item :span="2" label="内容">
            <div class="detail-content">
              <div
                v-if="
                  currentMemory.memoryType === 'thought' ||
                  currentMemory.memoryType === 'experience'
                "
                v-html="renderMarkdown(getMemoryContent(currentMemory))"
                class="markdown-content"
              ></div>
              <pre v-else class="memory-full-content">{{ getMemoryContent(currentMemory) }}</pre>
            </div>
          </el-descriptions-item>
          <el-descriptions-item :span="2" label="上下文">
            <pre class="memory-full-context">{{
              JSON.stringify(currentMemory.context || {}, null, 2)
            }}</pre>
          </el-descriptions-item>
          <el-descriptions-item v-if="currentMemory.confidence" label="置信度">
            {{ currentMemory.confidence }}
          </el-descriptions-item>
          <el-descriptions-item v-if="currentMemory.occurrences" label="出现次数">
            {{ currentMemory.occurrences }}
          </el-descriptions-item>
        </el-descriptions>
      </div>
      <template #footer>
        <el-button @click="detailDialogVisible = false">关闭</el-button>
      </template>
    </el-dialog>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, nextTick, watch } from 'vue'
import { ElMessage, ElMessageBox } from 'element-plus'
import { Memo, Search, ArrowUp, ArrowDown } from '@element-plus/icons-vue'
import MarkdownIt from 'markdown-it'
import hljs from 'highlight.js'
import MemoryControls from './MemoryControls.vue'
import MemoryStats from './MemoryStats.vue'
import MemoryEntry from './MemoryEntry.vue'

// 初始化 markdown-it
const md = new MarkdownIt({
  html: true,
  linkify: true,
  typographer: true,
  highlight: function (str, lang) {
    if (lang && hljs.getLanguage(lang)) {
      try {
        return hljs.highlight(str, { language: lang }).value
      } catch (__) {}
    }
    return '' // 使用外部默认转义
  },
})

// Props定义
interface MemoryEntry {
  id: string
  timestamp: number
  memoryType: 'thought' | 'conversation' | 'decision' | 'experience'
  importance?: 'high' | 'normal' | 'low'
  content?: string
  message?: string
  intention?: string
  result?: string
  lesson?: string
  context?: string | Record<string, unknown>
  confidence?: number
  occurrences?: number
}

interface Props {
  title?: string
  externalMemories?: MemoryEntry[]
  externalConnected?: boolean
  maxMemories?: number
  autoScroll?: boolean
}

const props = withDefaults(defineProps<Props>(), {
  title: '记忆查看器',
  externalMemories: () => [],
  externalConnected: false,
  maxMemories: 1000,
  autoScroll: true,
})

// 定义 emits
const emit = defineEmits<{
  connect: []
  disconnect: []
  queryMemory: []
  addMemory: []
  clearMemories: []
  deleteMemory: [memory: MemoryEntry]
}>()

// 定义组件名称
defineOptions({
  name: 'MemoryViewer',
})

// 响应式数据
const memories = computed(() => props.externalMemories || [])
const isConnected = computed(() => props.externalConnected || false)

const selectedTypes = ref<string[]>([])
const selectedImportance = ref<string[]>([])
const memoriesContainer = ref<HTMLElement>()
const expandedMemories = ref<Record<number, boolean>>({})

// 搜索相关
const searchQuery = ref('')
const searchMatchCount = ref(0)

// 自动滚动相关
const manualAutoScrollEnabled = ref(true)

// 统计数据相关
const statsVisible = ref(false)
const typeStats = ref<Record<string, number>>({})
const importanceStats = ref<Record<string, number>>({})
const lastStatsUpdate = ref(0)

// 记忆详情
const detailDialogVisible = ref(false)
const currentMemory = ref<MemoryEntry | null>(null)

// 配置数据
const availableTypes = ['thought', 'conversation', 'decision', 'experience']
const availableImportance = ['high', 'normal', 'low']

// 显示用的选中值（处理全选逻辑）
const displaySelectedTypes = computed({
  get: () => {
    if (selectedTypes.value.length === 0) {
      return availableTypes
    }
    if (selectedTypes.value.length === 1 && selectedTypes.value[0] === '__NONE__') {
      return []
    }
    return selectedTypes.value
  },
  set: (values: string[]) => {
    // 这里会被 handleTypeChange 处理，不直接设置
  },
})

const displaySelectedImportance = computed({
  get: () => {
    if (selectedImportance.value.length === 0) {
      return availableImportance
    }
    if (selectedImportance.value.length === 1 && selectedImportance.value[0] === '__NONE__') {
      return []
    }
    return selectedImportance.value
  },
  set: (values: string[]) => {
    // 这里会被 handleImportanceChange 处理，不直接设置
  },
})

// 全选状态检查
const isAllTypesSelected = computed(() => {
  return selectedTypes.value.length === 0 || selectedTypes.value.length === availableTypes.length
})

const isAllImportanceSelected = computed(() => {
  return (
    selectedImportance.value.length === 0 ||
    selectedImportance.value.length === availableImportance.length
  )
})

// 搜索匹配函数
const isSearchMatch = (memory: MemoryEntry, query: string): boolean => {
  if (!query.trim()) return true

  const searchText =
    `${getMemoryContent(memory)} ${getTypeLabel(memory.memoryType)} ${memory.id}`.toLowerCase()
  return searchText.includes(query.toLowerCase())
}

// 计算属性
const filteredMemories = computed(() => {
  const filtered = memories.value
    .filter((memory) => {
      // 类型过滤逻辑
      let typeMatch = false
      if (selectedTypes.value.length === 0) {
        typeMatch = true
      } else if (selectedTypes.value.length === 1 && selectedTypes.value[0] === '__NONE__') {
        typeMatch = false
      } else if (selectedTypes.value.length === availableTypes.length) {
        typeMatch = true
      } else {
        typeMatch = selectedTypes.value.includes(memory.memoryType)
      }

      // 重要性过滤逻辑
      let importanceMatch = false
      if (selectedImportance.value.length === 0) {
        importanceMatch = true
      } else if (
        selectedImportance.value.length === 1 &&
        selectedImportance.value[0] === '__NONE__'
      ) {
        importanceMatch = false
      } else if (selectedImportance.value.length === availableImportance.length) {
        importanceMatch = true
      } else {
        importanceMatch = selectedImportance.value.includes(memory.importance || 'normal')
      }

      // 搜索匹配逻辑
      const searchMatch = isSearchMatch(memory, searchQuery.value)

      return typeMatch && importanceMatch && searchMatch
    })
    .sort((a, b) => {
      // 按时间戳排序，最旧的在前，最新的在后
      return a.timestamp - b.timestamp
    })

  return filtered
})

// 工具函数
const getTypeLabel = (type: string) => {
  const labels: Record<string, string> = {
    thought: '思维',
    conversation: '对话',
    decision: '决策',
    experience: '经验',
  }
  return labels[type] || type
}

const getImportanceLabel = (importance?: string) => {
  const labels: Record<string, string> = {
    high: '高',
    normal: '正常',
    low: '低',
  }
  return labels[importance || 'normal'] || '正常'
}

const formatTimestamp = (timestamp: number) => {
  const date = new Date(timestamp)
  const timeString = date.toLocaleString('zh-CN', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
  })
  const milliseconds = String(date.getMilliseconds()).padStart(3, '0')
  return `${timeString}.${milliseconds}`
}

const getMemoryContent = (memory: MemoryEntry) => {
  switch (memory.memoryType) {
    case 'thought':
      return memory.content || ''
    case 'conversation':
      return memory.message || ''
    case 'decision':
      return memory.intention || memory.result || ''
    case 'experience':
      return memory.lesson || ''
    default:
      return ''
  }
}

// Markdown 渲染
const renderMarkdown = (content: string): string => {
  try {
    return md.render(content)
  } catch (error) {
    console.warn('Markdown 渲染失败:', error)
    return content
  }
}

// 切换展开
const toggleExpand = (index: number) => {
  expandedMemories.value[index] = !expandedMemories.value[index]
}

// 处理滚动
const handleScroll = () => {
  // 不再自动检测滚动位置，完全由用户通过按钮控制自动滚动
}

// 智能自动滚动到底部
const smartScrollToBottom = () => {
  if (!props.autoScroll) return
  if (!manualAutoScrollEnabled.value) return

  nextTick(() => {
    scrollToBottom()
  })
}

// 更新统计数据
const updateStats = () => {
  const now = Date.now()
  if (now - lastStatsUpdate.value < 1000) {
    return
  }

  lastStatsUpdate.value = now

  // 重置统计数据
  typeStats.value = {}
  importanceStats.value = {}

  // 统计各类型和重要性的记忆数量
  memories.value.forEach((memory) => {
    // 统计类型
    if (!typeStats.value[memory.memoryType]) {
      typeStats.value[memory.memoryType] = 0
    }
    typeStats.value[memory.memoryType]++

    // 统计重要性
    const importance = memory.importance || 'normal'
    if (!importanceStats.value[importance]) {
      importanceStats.value[importance] = 0
    }
    importanceStats.value[importance]++
  })
}

// 切换统计显示
const toggleStats = () => {
  statsVisible.value = !statsVisible.value
  if (statsVisible.value) {
    updateStats()
  }
}

// 导航功能
const scrollToTop = () => {
  if (memoriesContainer.value) {
    memoriesContainer.value.scrollTo({
      top: 0,
      behavior: 'smooth',
    })
  }
}

const scrollToBottom = () => {
  if (memoriesContainer.value) {
    memoriesContainer.value.scrollTo({
      top: memoriesContainer.value.scrollHeight,
      behavior: 'smooth',
    })
  }
}

// 筛选器事件处理
const handleTypeChange = (values: string[]) => {
  if (values.length === 0) {
    selectedTypes.value = ['__NONE__']
  } else if (values.length === availableTypes.length) {
    selectedTypes.value = []
  } else {
    selectedTypes.value = values
  }
}

const handleImportanceChange = (values: string[]) => {
  if (values.length === 0) {
    selectedImportance.value = ['__NONE__']
  } else if (values.length === availableImportance.length) {
    selectedImportance.value = []
  } else {
    selectedImportance.value = values
  }
}

const toggleAllTypes = () => {
  if (isAllTypesSelected.value) {
    selectedTypes.value = ['__NONE__']
  } else {
    selectedTypes.value = []
  }
}

const toggleAllImportance = () => {
  if (isAllImportanceSelected.value) {
    selectedImportance.value = ['__NONE__']
  } else {
    selectedImportance.value = []
  }
}

// 连接管理
const toggleConnection = () => {
  if (isConnected.value) {
    emit('disconnect')
  } else {
    emit('connect')
  }
}

// 查询记忆
const handleQueryMemory = () => {
  emit('queryMemory')
}

// 添加记忆
const handleAddMemory = () => {
  emit('addMemory')
}

// 清空记忆列表
const clearMemories = async () => {
  try {
    await ElMessageBox.confirm('确定要清空所有记忆吗？', '提示', {
      confirmButtonText: '确定',
      cancelButtonText: '取消',
      type: 'warning',
    })

    emit('clearMemories')

    // 重置筛选状态
    selectedTypes.value = []
    selectedImportance.value = []
    searchQuery.value = ''
    expandedMemories.value = {}

    // 更新统计数据
    updateStats()

    ElMessage.success('记忆列表已清空')
  } catch {
    // 用户取消操作
  }
}

// 查看记忆详情
const handleViewDetail = (memory: MemoryEntry) => {
  currentMemory.value = memory
  detailDialogVisible.value = true
}

// 删除记忆
const handleDelete = (memory: MemoryEntry) => {
  emit('deleteMemory', memory)
}

// 切换自动滚动
const toggleAutoScroll = () => {
  manualAutoScrollEnabled.value = !manualAutoScrollEnabled.value
  ElMessage.success(manualAutoScrollEnabled.value ? '已开启自动滚动' : '已暂停自动滚动')

  if (manualAutoScrollEnabled.value) {
    nextTick(() => {
      scrollToBottom()
    })
  }
}

// 监听记忆数据变化，触发自动滚动
watch(
  () => memories.value.length,
  (newLength, oldLength) => {
    if (newLength > oldLength) {
      setTimeout(() => {
        smartScrollToBottom()
      }, 50)
    }
  },
)

// 监听过滤后的记忆变化，更新搜索匹配计数
watch(
  () => filteredMemories.value,
  (newFilteredMemories) => {
    searchMatchCount.value = searchQuery.value ? newFilteredMemories.length : 0
  },
  { immediate: true },
)
</script>

<style scoped>
.memory-viewer {
  height: 100%;
  display: flex;
  flex-direction: column;
  padding: 20px;
}

.header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
  background: white;
  padding: 16px 20px;
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

.title {
  display: flex;
  align-items: center;
  gap: 8px;
  margin: 0;
  font-size: 24px;
  color: #333;
}

.title-icon {
  color: #409eff;
}

.filters {
  background: white;
  padding: 12px 16px;
  border-radius: 6px;
  margin-bottom: 16px;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
}

.filter-container {
  display: flex;
  align-items: center;
  gap: 20px;
  flex-wrap: wrap;
}

.filter-item {
  display: flex;
  align-items: center;
  gap: 8px;
}

.filter-label {
  font-size: 13px;
  color: #666;
  font-weight: 500;
  white-space: nowrap;
}

.select-all-option {
  width: 100%;
  justify-content: center;
  border-bottom: 1px solid #e4e7ed;
  border-radius: 0;
  margin-bottom: 6px;
  padding-bottom: 6px;
}

.type-option,
.importance-option {
  font-size: 12px;
  font-weight: 500;
  padding: 2px 6px;
  border-radius: 3px;
}

.type-thought {
  background-color: #e6f7ff;
  color: #1890ff;
}

.type-conversation {
  background-color: #f6ffed;
  color: #52c41a;
}

.type-decision {
  background-color: #fffbe6;
  color: #faad14;
}

.type-experience {
  background-color: #f0f0f0;
  color: #666;
}

.importance-high {
  background-color: #fff2f0;
  color: #ff4d4f;
}

.importance-normal {
  background-color: #fffbe6;
  color: #faad14;
}

.importance-low {
  background-color: #f0f0f0;
  color: #666;
}

.search-section {
  display: flex;
  align-items: center;
  gap: 12px;
  flex-shrink: 0;
}

.search-input {
  width: 200px;
}

.search-stats {
  font-size: 11px;
  color: #666;
  padding: 2px 6px;
  background: #e3f2fd;
  border-radius: 3px;
  white-space: nowrap;
  min-width: 40px;
  text-align: center;
}

.memories-container {
  flex: 1;
  background: white;
  border-radius: 8px;
  padding: 16px;
  overflow-y: auto;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  font-family: 'Monaco', 'Menlo', 'Ubuntu Mono', monospace;
  position: relative;
}

.navigation-buttons {
  position: fixed;
  right: 30px;
  bottom: 100px;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 12px;
  z-index: 1000;
}

.nav-btn {
  width: 40px !important;
  height: 40px !important;
  min-width: 40px !important;
  min-height: 40px !important;
  padding: 0 !important;
  margin: 0 !important;
  border-radius: 50% !important;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.15);
  transition: all 0.3s ease;
  display: flex !important;
  align-items: center !important;
  justify-content: center !important;
}

.nav-btn:hover {
  transform: scale(1.1);
  box-shadow: 0 4px 12px rgba(64, 158, 255, 0.3);
}

.no-memories {
  display: flex;
  justify-content: center;
  align-items: center;
  height: 200px;
}

.memory-detail {
  max-height: 500px;
  overflow-y: auto;
}

.detail-content {
  min-height: 100px;
}

.memory-full-content,
.memory-full-context {
  margin: 0;
  white-space: pre-wrap;
  word-break: break-word;
  font-family: 'Courier New', monospace;
  font-size: 12px;
  background: #f5f7fa;
  padding: 10px;
  border-radius: 4px;
  border: 1px solid #e4e7ed;
}

.markdown-content {
  white-space: normal;
  min-height: 100px;
  padding: 10px;
  background: #f5f7fa;
  border-radius: 4px;
  border: 1px solid #e4e7ed;
}

.markdown-content h1,
.markdown-content h2,
.markdown-content h3,
.markdown-content h4,
.markdown-content h5,
.markdown-content h6 {
  margin: 8px 0 4px 0;
  font-weight: 600;
  color: #303133;
}

.markdown-content h1 {
  font-size: 18px;
  border-bottom: 1px solid #e4e7ed;
  padding-bottom: 4px;
}
.markdown-content h2 {
  font-size: 16px;
  border-bottom: 1px solid #e4e7ed;
  padding-bottom: 2px;
}
.markdown-content h3 {
  font-size: 14px;
}
.markdown-content h4 {
  font-size: 13px;
}
.markdown-content h5 {
  font-size: 12px;
}
.markdown-content h6 {
  font-size: 12px;
  color: #606266;
}

.markdown-content p {
  margin: 4px 0;
  line-height: 1.6;
}

.markdown-content ul,
.markdown-content ol {
  margin: 4px 0;
  padding-left: 20px;
}

.markdown-content li {
  margin: 2px 0;
}

.markdown-content blockquote {
  margin: 8px 0;
  padding: 8px 12px;
  border-left: 4px solid #e6a23c;
  background: #fffbe6;
  color: #e6a23c;
}

.markdown-content code {
  background: #f6f8fa;
  color: #d73a49;
  padding: 2px 4px;
  border-radius: 3px;
  font-family: 'Monaco', 'Menlo', 'Ubuntu Mono', monospace;
  font-size: 12px;
}

.markdown-content pre {
  background: #f6f8fa;
  border: 1px solid #e1e4e8;
  border-radius: 6px;
  padding: 12px;
  overflow-x: auto;
  margin: 8px 0;
}

.markdown-content pre code {
  background: none;
  color: inherit;
  padding: 0;
  border-radius: 0;
}

.markdown-content table {
  border-collapse: collapse;
  width: 100%;
  margin: 8px 0;
}

.markdown-content th,
.markdown-content td {
  border: 1px solid #e1e4e8;
  padding: 6px 12px;
  text-align: left;
}

.markdown-content th {
  background: #f6f8fa;
  font-weight: 600;
}

.markdown-content a {
  color: #409eff;
  text-decoration: none;
}

.markdown-content a:hover {
  text-decoration: underline;
}

/* 响应式设计 */
@media (max-width: 1024px) {
  .filter-container {
    flex-direction: column;
    align-items: stretch;
    gap: 12px;
  }

  .filter-item {
    justify-content: space-between;
  }

  .search-section {
    justify-content: space-between;
  }

  .search-input {
    flex: 1;
    max-width: 200px;
  }
}

@media (max-width: 768px) {
  .filters {
    padding: 8px 12px;
  }

  .filter-container {
    gap: 10px;
  }

  .filter-item {
    flex-direction: column;
    align-items: stretch;
  }

  .filter-label {
    margin-bottom: 4px;
  }

  .search-section {
    flex-wrap: wrap;
    gap: 8px;
  }

  .search-input {
    width: 100%;
    max-width: none;
  }
}
</style>
