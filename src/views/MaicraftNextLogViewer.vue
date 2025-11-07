<template>
  <!-- 
    复用 Maicraft 的 LogViewer 组件
    通过 externalMode 模式传入外部数据源和连接状态
    保持 UI 和功能的完全一致性
  -->
  <LogViewer
    title="Maicraft-Next 日志查看器"
    :external-mode="true"
    :external-logs="logs"
    :external-connected="isConnected"
    :max-logs="1000"
    :auto-scroll="true"
    @connect="handleConnect"
    @disconnect="handleDisconnect"
    @clear-logs="handleClearLogs"
  />
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue'
import LogViewer from '@/components/logging/LogViewer.vue'
import {
  getMaicraftNextWebSocketManager,
  connectMaicraftNext,
  disconnectMaicraftNext,
  subscribeMaicraftNext,
} from '../services/maicraftNextWebSocket'
import type { MaicraftNextLogMessage } from '../types/maicraft-next'
import { ElMessage } from 'element-plus'

// 定义组件名称
defineOptions({
  name: 'MaicraftNextLogViewer',
})

// 日志接口 - 与 LogViewer 组件的 LogEntry 接口兼容
interface LogEntry {
  timestamp: number | string
  level: string
  module: string
  message: string
  count?: number
  lastTimestamp?: number | string
  merged?: boolean
  formatted_timestamp?: string
}

// 响应式数据
const logs = ref<LogEntry[]>([])
const isConnected = ref(false)

// 连接处理
const handleConnect = async () => {
  try {
    connectMaicraftNext()
    // 等待连接建立
    await new Promise((resolve) => setTimeout(resolve, 1000))
    // 订阅日志
    subscribeMaicraftNext(['logs'], 0)
    ElMessage.success('连接成功')
  } catch (error) {
    console.error('连接失败:', error)
    ElMessage.error('连接失败')
  }
}

// 断开连接处理
const handleDisconnect = () => {
  disconnectMaicraftNext()
  ElMessage.info('已断开连接')
}

// 清空日志处理
const handleClearLogs = () => {
  logs.value = []
}

// 组件挂载
onMounted(() => {
  // 获取管理器并添加消息处理器
  const manager = getMaicraftNextWebSocketManager()

  // 处理连接状态变化
  const handleConnectionChange = (connected: boolean) => {
    isConnected.value = connected
  }

  // 处理消息
  const handleMessage = (message: any) => {
    // 处理日志消息 - 注意：服务端推送的类型是 logsUpdate
    if (message.type === 'logsUpdate' && message.data) {
      const logData = message.data
      logs.value.push({
        timestamp: logData.timestamp || Date.now(),
        level: logData.level || 'INFO',
        module: logData.module || 'Unknown',
        message: logData.message || '',
      })

      // 限制日志数量
      if (logs.value.length > 1000) {
        logs.value.shift()
      }
    }
  }

  // 添加处理器
  manager.addConnectionHandler(handleConnectionChange)
  manager.addMessageHandler(handleMessage)

  // 如果已经连接，更新状态
  isConnected.value = manager.isConnected

  // 组件卸载时清理
  onUnmounted(() => {
    manager.removeConnectionHandler(handleConnectionChange)
    manager.removeMessageHandler(handleMessage)
  })
})
</script>

<style scoped>
/* 使用 LogViewer 组件的样式，这里不需要额外样式 */
</style>
