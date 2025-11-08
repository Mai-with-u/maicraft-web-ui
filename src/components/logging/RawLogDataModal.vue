<template>
  <el-dialog
    v-model="visible"
    title="原始 WebSocket 数据"
    width="800px"
    :close-on-click-modal="false"
    :close-on-press-escape="true"
    class="raw-log-modal"
  >
    <div class="modal-content">
      <!-- 原始数据展示 -->
      <div class="raw-data-section">
        <div class="section-header">
          <h4>完整的 WebSocket 消息</h4>
          <div class="actions">
            <el-button size="small" type="primary" @click="copyToClipboard"> 复制 </el-button>
            <el-button size="small" @click="formatJson = !formatJson">
              {{ formatJson ? '压缩' : '格式化' }}
            </el-button>
          </div>
        </div>

        <div class="json-container">
          <pre
            class="json-content"
            :class="{ formatted: formatJson }"
            ref="jsonContent"
          ><code>{{ displayJson }}</code></pre>
        </div>
      </div>

      <!-- 数据结构说明 -->
      <div class="data-structure-section" v-if="parsedData">
        <h4>数据结构说明</h4>
        <div class="structure-info">
          <div class="info-item">
            <span class="label">消息类型:</span>
            <span class="value">{{ parsedData.type }}</span>
          </div>
          <div class="info-item">
            <span class="label">服务器时间戳:</span>
            <span class="value">{{ formatTimestamp(parsedData.timestamp) }}</span>
          </div>
          <div class="info-item">
            <span class="label">消息ID:</span>
            <span class="value">{{ parsedData.messageId }}</span>
          </div>
          <div class="info-item">
            <span class="label">日志级别:</span>
            <span
              class="value level-badge"
              :class="`level-${parsedData.data?.level?.toLowerCase()}`"
            >
              {{ parsedData.data?.level }}
            </span>
          </div>
          <div class="info-item">
            <span class="label">日志模块:</span>
            <span class="value">{{ parsedData.data?.module }}</span>
          </div>
          <div class="info-item">
            <span class="label">日志时间戳:</span>
            <span class="value">{{ formatTimestamp(parsedData.data?.timestamp) }}</span>
          </div>
        </div>
      </div>

      <!-- 日志消息内容 -->
      <div class="message-section" v-if="parsedData?.data?.message">
        <h4>日志消息内容</h4>
        <div class="message-content">
          <pre>{{ parsedData.data.message }}</pre>
        </div>
      </div>
    </div>

    <template #footer>
      <div class="dialog-footer">
        <el-button @click="visible = false">关闭</el-button>
      </div>
    </template>
  </el-dialog>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { ElMessage } from 'element-plus'

// Props定义
interface Props {
  modelValue: boolean
  rawData: any // 原始 WebSocket 消息数据
}

const props = defineProps<Props>()

// Emits定义
const emit = defineEmits<{
  'update:modelValue': [value: boolean]
}>()

// 响应式数据
const visible = computed({
  get: () => props.modelValue,
  set: (value) => emit('update:modelValue', value),
})

const formatJson = ref(true)
const jsonContent = ref<HTMLElement>()

// 解析后的数据
const parsedData = computed(() => {
  if (!props.rawData) return null
  try {
    // 如果已经是对象，直接返回
    if (typeof props.rawData === 'object') {
      return props.rawData
    }
    // 如果是字符串，尝试解析
    return JSON.parse(props.rawData)
  } catch (error) {
    console.warn('解析原始数据失败:', error)
    return null
  }
})

// 显示用的JSON字符串
const displayJson = computed(() => {
  if (!parsedData.value) return '{}'

  if (formatJson.value) {
    return JSON.stringify(parsedData.value, null, 2)
  } else {
    return JSON.stringify(parsedData.value)
  }
})

// 格式化时间戳
const formatTimestamp = (timestamp: number | string): string => {
  if (!timestamp) return '未知'

  try {
    const date = new Date(Number(timestamp))
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
  } catch (error) {
    return '时间格式错误'
  }
}

// 复制到剪贴板
const copyToClipboard = async () => {
  try {
    await navigator.clipboard.writeText(displayJson.value)
    ElMessage.success('已复制到剪贴板')
  } catch (error) {
    console.error('复制失败:', error)
    ElMessage.error('复制失败')
  }
}
</script>

<style scoped>
.raw-log-modal :deep(.el-dialog) {
  --el-dialog-padding-primary: 20px;
}

.modal-content {
  max-height: 70vh;
  overflow-y: auto;
}

.raw-data-section,
.data-structure-section,
.message-section {
  margin-bottom: 24px;
}

.section-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 12px;
  padding-bottom: 8px;
  border-bottom: 1px solid #e4e7ed;
}

.section-header h4 {
  margin: 0;
  color: #303133;
  font-size: 16px;
  font-weight: 500;
}

.actions {
  display: flex;
  gap: 8px;
}

.json-container {
  border: 1px solid #dcdfe6;
  border-radius: 4px;
  background-color: #f8f9fa;
  overflow: hidden;
}

.json-content {
  margin: 0;
  padding: 16px;
  font-family: 'Monaco', 'Menlo', 'Ubuntu Mono', monospace;
  font-size: 13px;
  line-height: 1.5;
  color: #303133;
  white-space: pre-wrap;
  word-break: break-all;
  max-height: 400px;
  overflow-y: auto;
  background-color: #f8f9fa;
}

.json-content.formatted {
  background-color: #ffffff;
  border-left: 3px solid #409eff;
}

.json-content code {
  font-family: inherit;
}

.structure-info {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 12px;
  padding: 16px;
  background-color: #f8f9fa;
  border-radius: 4px;
  border: 1px solid #e4e7ed;
}

.info-item {
  display: flex;
  align-items: center;
  gap: 8px;
}

.label {
  font-weight: 500;
  color: #606266;
  min-width: 80px;
  flex-shrink: 0;
}

.value {
  color: #303133;
  font-family: 'Monaco', 'Menlo', 'Ubuntu Mono', monospace;
  font-size: 13px;
  background-color: #ffffff;
  padding: 4px 8px;
  border-radius: 3px;
  border: 1px solid #dcdfe6;
  word-break: break-all;
}

.level-badge {
  font-weight: bold;
  text-align: center;
  min-width: 60px;
}

.level-trace {
  background-color: #f0f0f0 !important;
  color: #666 !important;
}

.level-debug {
  background-color: #e6f7ff !important;
  color: #1890ff !important;
}

.level-info {
  background-color: #f6ffed !important;
  color: #52c41a !important;
}

.level-success {
  background-color: #f6ffed !important;
  color: #52c41a !important;
}

.level-warning {
  background-color: #fffbe6 !important;
  color: #faad14 !important;
}

.level-error {
  background-color: #fff2f0 !important;
  color: #ff4d4f !important;
}

.level-critical {
  background-color: #ffe6e6 !important;
  color: #cf1322 !important;
}

.message-section h4 {
  margin: 0 0 12px 0;
  color: #303133;
  font-size: 16px;
  font-weight: 500;
}

.message-content {
  padding: 16px;
  background-color: #f8f9fa;
  border: 1px solid #e4e7ed;
  border-radius: 4px;
  font-family: 'Monaco', 'Menlo', 'Ubuntu Mono', monospace;
  font-size: 13px;
  line-height: 1.5;
  white-space: pre-wrap;
  word-break: break-word;
  max-height: 200px;
  overflow-y: auto;
}

.message-content pre {
  margin: 0;
  color: #303133;
}

.dialog-footer {
  text-align: right;
}

/* 响应式设计 */
@media (max-width: 768px) {
  .raw-log-modal :deep(.el-dialog) {
    width: 95vw !important;
    margin: 5vh auto !important;
  }

  .section-header {
    flex-direction: column;
    align-items: flex-start;
    gap: 8px;
  }

  .actions {
    width: 100%;
    justify-content: flex-end;
  }

  .structure-info {
    grid-template-columns: 1fr;
    gap: 8px;
  }

  .info-item {
    flex-direction: column;
    align-items: flex-start;
    gap: 4px;
  }

  .label {
    min-width: auto;
  }
}
</style>
