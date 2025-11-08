<template>
  <div class="memory-entry" :class="[getMemoryTypeClass(memory.memoryType)]" @click="$emit('viewDetail')">
    <!-- 展开/收起按钮 -->
    <div class="memory-expand-btn">
      <el-button
        v-if="getMemoryContent(memory).length > 150"
        :type="expanded ? 'primary' : 'info'"
        size="small"
        @click.stop="$emit('toggleExpand')"
        :icon="expanded ? ArrowUp : ArrowDown"
        class="expand-toggle-btn"
        circle
      />
      <div v-else class="expand-placeholder"></div>
    </div>

    <div class="memory-content">
      <!-- 序号 -->
      <div v-if="lineNumber" class="memory-line-number">
        {{ lineNumber }}
      </div>

      <!-- 时间戳 -->
      <div class="memory-time">
        {{ formatTimestamp(memory.timestamp) }}
      </div>

      <!-- 记忆类型 -->
      <div class="memory-type">
        <el-tag :type="getMemoryTypeTag(memory.memoryType)" size="small">
          {{ getMemoryTypeLabel(memory.memoryType) }}
        </el-tag>
      </div>

      <!-- 重要性 -->
      <div v-if="memory.importance" class="memory-importance">
        <el-tag :type="getImportanceTag(memory.importance)" size="small">
          {{ getImportanceLabel(memory.importance) }}
        </el-tag>
      </div>

      <!-- 记忆内容 -->
      <div class="memory-message">
        <div class="message-header" v-if="shouldShowMarkdownToggle">
          <el-button
            size="mini"
            :type="isMarkdownMode ? 'success' : 'info'"
            @click.stop="toggleMarkdownMode"
            :icon="isMarkdownMode ? 'Document' : 'Document'"
            class="markdown-toggle-btn"
          >
            {{ isMarkdownMode ? '渲染' : '文本' }}
          </el-button>
        </div>

        <div class="message-content">
          <!-- 预览模式 -->
          <div v-if="getMemoryContent(memory).length > 150 && !expanded" class="message-preview">
            <div v-if="isMarkdownMode && shouldShowMarkdown" v-html="renderMarkdown(truncateContent(getMemoryContent(memory)))"></div>
            <div v-else>{{ truncateContent(getMemoryContent(memory)) }}</div>
          </div>

          <!-- 展开模式 -->
          <div
            v-else-if="getMemoryContent(memory).length > 150 && expanded"
            class="message-expanded"
          >
            <div v-if="isMarkdownMode && shouldShowMarkdown" v-html="renderMarkdown(getMemoryContent(memory))" class="markdown-content"></div>
            <div v-else class="message-full">{{ getMemoryContent(memory) }}</div>
          </div>

          <!-- 普通模式 -->
          <div v-else class="message-normal">
            <div v-if="isMarkdownMode && shouldShowMarkdown" v-html="renderMarkdown(getMemoryContent(memory))" class="markdown-content"></div>
            <div v-else>{{ getMemoryContent(memory) }}</div>
          </div>
        </div>
      </div>
    </div>

    <!-- 操作按钮 -->
    <div class="memory-actions">
      <el-button size="small" type="primary" @click.stop="$emit('viewDetail')" plain circle>
        <el-icon><View /></el-icon>
      </el-button>
      <el-button size="small" type="danger" @click.stop="$emit('delete')" plain circle>
        <el-icon><Delete /></el-icon>
      </el-button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { ArrowDown, ArrowUp, View, Delete } from '@element-plus/icons-vue'
import MarkdownIt from 'markdown-it'
import hljs from 'highlight.js'

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
  }
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
  memory: MemoryEntry
  lineNumber?: number
  expanded?: boolean
}

const props = withDefaults(defineProps<Props>(), {
  expanded: false,
})

// 响应式数据
const isMarkdownMode = ref(true) // 默认启用 markdown 模式

// 定义组件名称
defineOptions({
  name: 'MemoryEntry',
})

// 工具函数
const getMemoryTypeLabel = (type: string) => {
  const labels: Record<string, string> = {
    thought: '思维',
    conversation: '对话',
    decision: '决策',
    experience: '经验',
  }
  return labels[type] || type
}

const getMemoryTypeTag = (type: string) => {
  const tags: Record<string, string> = {
    thought: 'primary',
    conversation: 'success',
    decision: 'warning',
    experience: 'info',
  }
  return tags[type] || 'info'
}

const getMemoryTypeClass = (type: string) => {
  return `memory-${type}`
}

const getImportanceLabel = (importance?: string) => {
  const labels: Record<string, string> = {
    high: '高',
    normal: '正常',
    low: '低',
  }
  return labels[importance || 'normal'] || '正常'
}

const getImportanceTag = (importance?: string) => {
  const tags: Record<string, string> = {
    high: 'danger',
    normal: 'warning',
    low: 'info',
  }
  return tags[importance || 'normal'] || 'warning'
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

const truncateContent = (content: string): string => {
  if (content.length <= 150) return content
  return content.substring(0, 150) + '...'
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

// 是否应该显示 markdown 切换按钮
const shouldShowMarkdownToggle = computed(() => {
  const content = getMemoryContent(props.memory)
  return content && content.trim().length > 0
})

// 是否应该显示为 markdown（思维类型和经验类型默认显示）
const shouldShowMarkdown = computed(() => {
  return props.memory.memoryType === 'thought' || props.memory.memoryType === 'experience'
})

// 切换 markdown 模式
const toggleMarkdownMode = () => {
  isMarkdownMode.value = !isMarkdownMode.value
}

// 初始化时根据记忆类型设置默认模式
onMounted(() => {
  // 思维类型和经验类型默认启用 markdown，其他类型默认关闭
  isMarkdownMode.value = props.memory.memoryType === 'thought' || props.memory.memoryType === 'experience'
})

// 事件定义
defineEmits<{
  toggleExpand: []
  viewDetail: []
  delete: []
}>()
</script>

<style scoped>
.memory-entry {
  display: flex;
  align-items: flex-start;
  padding: 8px 12px;
  margin-bottom: 2px;
  border-radius: 4px;
  transition: all 0.2s;
  gap: 8px;
  cursor: pointer;
}

.memory-entry:hover {
  background-color: rgba(64, 158, 255, 0.05);
  box-shadow: 0 2px 8px rgba(64, 158, 255, 0.1);
  transform: translateY(-1px);
}

/* 不同类型记忆的边框颜色 */
.memory-thought {
  border-left: 3px solid #409eff;
}

.memory-conversation {
  border-left: 3px solid #67c23a;
}

.memory-decision {
  border-left: 3px solid #e6a23c;
}

.memory-experience {
  border-left: 3px solid #909399;
}

.memory-expand-btn {
  flex-shrink: 0;
  margin-top: 2px;
  width: 28px;
  height: 28px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.expand-placeholder {
  width: 28px;
  height: 28px;
}

.expand-toggle-btn {
  opacity: 0.7;
  transition:
    opacity 0.2s,
    transform 0.2s;
}

.expand-toggle-btn:hover {
  opacity: 1;
  transform: scale(1.05);
}

.memory-content {
  flex: 1;
  display: flex;
  align-items: flex-start;
  gap: 12px;
}

.memory-line-number {
  color: #999;
  font-size: 11px;
  min-width: 40px;
  text-align: right;
  margin-right: 8px;
  padding-right: 8px;
  border-right: 1px solid #e9ecef;
  font-family: 'Monaco', 'Menlo', 'Ubuntu Mono', monospace;
  user-select: none;
}

.memory-time {
  color: #999;
  font-size: 12px;
  min-width: 160px;
  margin-right: 12px;
  font-family: 'Monaco', 'Menlo', 'Ubuntu Mono', monospace;
}

.memory-type {
  min-width: 60px;
}

.memory-importance {
  min-width: 50px;
}

.memory-message {
  flex: 1;
}

.message-header {
  margin-bottom: 8px;
  display: flex;
  justify-content: flex-end;
}

.markdown-toggle-btn {
  font-size: 11px;
  padding: 2px 8px;
  height: 24px;
}

.message-content {
  white-space: pre-wrap;
  word-break: break-word;
}

.message-preview,
.message-full,
.message-normal {
  white-space: pre-wrap;
  word-break: break-word;
}

.markdown-content {
  white-space: normal;
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

.markdown-content h1 { font-size: 18px; border-bottom: 1px solid #e4e7ed; padding-bottom: 4px; }
.markdown-content h2 { font-size: 16px; border-bottom: 1px solid #e4e7ed; padding-bottom: 2px; }
.markdown-content h3 { font-size: 14px; }
.markdown-content h4 { font-size: 13px; }
.markdown-content h5 { font-size: 12px; }
.markdown-content h6 { font-size: 12px; color: #606266; }

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

.message-preview,
.message-full,
.message-normal,
.message-expanded {
  white-space: pre-wrap;
  word-break: break-word;
}

.memory-actions {
  display: flex;
  gap: 4px;
  flex-shrink: 0;
  margin-top: 2px;
}

/* 响应式设计 */
@media (max-width: 768px) {
  .memory-content {
    flex-direction: column;
    gap: 8px;
  }

  .memory-time {
    margin-right: 0;
  }

  .memory-message {
    min-width: auto;
  }

  .memory-actions {
    margin-top: 8px;
    justify-content: flex-end;
  }
}
</style>

