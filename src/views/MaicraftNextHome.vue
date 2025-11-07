<template>
  <div class="maicraft-next-home">
    <!-- 页面标题 -->
    <div class="header">
      <h1 class="title">
        <el-icon class="title-icon"><House /></el-icon>
        Maicraft-Next 控制台
      </h1>
    </div>

    <!-- 连接状态卡片 -->
    <el-row :gutter="20" class="status-row">
      <el-col :span="8">
        <el-card class="status-card">
          <template #header>
            <div class="card-header">
              <el-icon><Connection /></el-icon>
              <span>连接状态</span>
            </div>
          </template>
          <div class="status-content">
            <div :class="['status-indicator', isConnected ? 'connected' : 'disconnected']">
              <div class="status-dot"></div>
              <span class="status-text">{{ isConnected ? '已连接' : '未连接' }}</span>
            </div>
            <el-button
              :type="isConnected ? 'danger' : 'primary'"
              @click="toggleConnection"
              :loading="isConnecting"
              class="mt-3"
            >
              {{ isConnected ? '断开连接' : '连接服务器' }}
            </el-button>
          </div>
        </el-card>
      </el-col>

      <el-col :span="8">
        <el-card class="status-card">
          <template #header>
            <div class="card-header">
              <el-icon><DataLine /></el-icon>
              <span>订阅状态</span>
            </div>
          </template>
          <div class="status-content">
            <div class="subscription-info">
              <p class="info-label">已订阅数据类型:</p>
              <div class="subscription-tags">
                <el-tag
                  v-for="type in subscribedTypes"
                  :key="type"
                  size="small"
                  class="mr-1 mb-1"
                  type="success"
                >
                  {{ type }}
                </el-tag>
                <el-tag v-if="subscribedTypes.length === 0" size="small" type="info">
                  无订阅
                </el-tag>
              </div>
            </div>
          </div>
        </el-card>
      </el-col>

      <el-col :span="8">
        <el-card class="status-card">
          <template #header>
            <div class="card-header">
              <el-icon><Clock /></el-icon>
              <span>最后更新</span>
            </div>
          </template>
          <div class="status-content">
            <div class="update-info">
              <p class="update-time">{{ lastUpdateText }}</p>
              <p class="update-timestamp">{{ lastUpdateFullTime }}</p>
            </div>
          </div>
        </el-card>
      </el-col>
    </el-row>

    <!-- 快速操作 -->
    <el-card class="quick-actions-card">
      <template #header>
        <div class="card-header">
          <el-icon><Operation /></el-icon>
          <span>快速操作</span>
        </div>
      </template>
      <div class="quick-actions">
        <el-button type="primary" @click="subscribeAllData" :disabled="!isConnected">
          <el-icon class="mr-1"><Plus /></el-icon>
          订阅所有数据
        </el-button>
        <el-button type="warning" @click="unsubscribeAllData" :disabled="!isConnected">
          <el-icon class="mr-1"><Minus /></el-icon>
          取消所有订阅
        </el-button>
        <el-button type="success" @click="goToLogs">
          <el-icon class="mr-1"><Document /></el-icon>
          查看日志
        </el-button>
      </div>
    </el-card>

    <!-- 服务器信息 -->
    <el-card class="info-card">
      <template #header>
        <div class="card-header">
          <el-icon><InfoFilled /></el-icon>
          <span>服务器信息</span>
        </div>
      </template>
      <div class="server-info">
        <el-descriptions :column="2" border>
          <el-descriptions-item label="WebSocket 地址">
            {{ wsUrl }}
          </el-descriptions-item>
          <el-descriptions-item label="心跳间隔">30秒</el-descriptions-item>
          <el-descriptions-item label="自动重连">启用</el-descriptions-item>
          <el-descriptions-item label="最大重连次数">5次</el-descriptions-item>
          <el-descriptions-item label="支持的数据类型" :span="2">
            <el-tag v-for="type in supportedDataTypes" :key="type" size="small" class="mr-1">
              {{ type }}
            </el-tag>
          </el-descriptions-item>
        </el-descriptions>
      </div>
    </el-card>

    <!-- 实时消息 -->
    <el-card class="messages-card">
      <template #header>
        <div class="card-header">
          <el-icon><Message /></el-icon>
          <span>最近消息</span>
          <el-button text size="small" @click="clearMessages" class="ml-auto">
            清空
          </el-button>
        </div>
      </template>
      <div class="messages-list">
        <div v-if="recentMessages.length === 0" class="empty-messages">
          <el-empty description="暂无消息" :image-size="80" />
        </div>
        <div v-else class="message-items">
          <div
            v-for="(msg, index) in recentMessages"
            :key="index"
            class="message-item"
          >
            <div class="message-header">
              <el-tag :type="getMessageType(msg.type)" size="small">
                {{ msg.type }}
              </el-tag>
              <span class="message-time">{{ formatTime(msg.timestamp) }}</span>
            </div>
            <div class="message-content">
              <pre>{{ JSON.stringify(msg, null, 2) }}</pre>
            </div>
          </div>
        </div>
      </div>
    </el-card>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, onUnmounted } from 'vue'
import { useRouter } from 'vue-router'
import {
  getMaicraftNextWebSocketManager,
  connectMaicraftNext,
  disconnectMaicraftNext,
  subscribeMaicraftNext,
  unsubscribeMaicraftNext,
} from '../services/maicraftNextWebSocket'
import {
  House,
  Connection,
  DataLine,
  Clock,
  Operation,
  Plus,
  Minus,
  Document,
  InfoFilled,
  Message,
} from '@element-plus/icons-vue'
import { ElMessage } from 'element-plus'

// 定义组件名称
defineOptions({
  name: 'MaicraftNextHome',
})

const router = useRouter()

// 响应式数据
const isConnected = ref(false)
const isConnecting = ref(false)
const subscribedTypes = ref<string[]>([])
const lastUpdate = ref(0)
const recentMessages = ref<any[]>([])
const wsUrl = ref('ws://localhost:25114/ws')

// 支持的数据类型
const supportedDataTypes = ['player', 'world', 'logs', 'tasks', 'memory', 'usage']

// 最后更新时间文本
const lastUpdateText = computed(() => {
  if (!lastUpdate.value) return '从未'
  const now = Date.now()
  const diff = now - lastUpdate.value
  if (diff < 1000) return '刚刚'
  if (diff < 60000) return `${Math.floor(diff / 1000)}秒前`
  if (diff < 3600000) return `${Math.floor(diff / 60000)}分钟前`
  return `${Math.floor(diff / 3600000)}小时前`
})

// 最后更新完整时间
const lastUpdateFullTime = computed(() => {
  if (!lastUpdate.value) return '-'
  return new Date(lastUpdate.value).toLocaleString('zh-CN')
})

// 格式化时间
const formatTime = (timestamp?: number) => {
  if (!timestamp) return '-'
  return new Date(timestamp).toLocaleTimeString('zh-CN')
}

// 获取消息类型对应的标签类型
const getMessageType = (type: string) => {
  const typeMap: Record<string, any> = {
    subscriptionConfirmed: 'success',
    logsUpdate: 'primary',
    player: 'warning',
    world: 'info',
    error: 'danger',
    ping: '',
    pong: '',
  }
  return typeMap[type] || 'info'
}

// 切换连接
const toggleConnection = async () => {
  if (isConnected.value) {
    disconnectMaicraftNext()
    ElMessage.info('已断开连接')
  } else {
    isConnecting.value = true
    try {
      connectMaicraftNext(wsUrl.value)
      await new Promise((resolve) => setTimeout(resolve, 1000))
      ElMessage.success('连接成功')
    } catch (error) {
      console.error('连接失败:', error)
      ElMessage.error('连接失败')
    } finally {
      isConnecting.value = false
    }
  }
}

// 订阅所有数据
const subscribeAllData = () => {
  const success = subscribeMaicraftNext(supportedDataTypes, 0)
  if (success) {
    ElMessage.success('已发送订阅请求')
  } else {
    ElMessage.error('发送订阅请求失败')
  }
}

// 取消所有订阅
const unsubscribeAllData = () => {
  const success = unsubscribeMaicraftNext(supportedDataTypes)
  if (success) {
    ElMessage.success('已取消所有订阅')
  } else {
    ElMessage.error('取消订阅失败')
  }
}

// 跳转到日志页面
const goToLogs = () => {
  router.push('/maicraft-next/logs')
}

// 清空消息
const clearMessages = () => {
  recentMessages.value = []
  ElMessage.success('已清空消息')
}

// 组件挂载
onMounted(() => {
  const manager = getMaicraftNextWebSocketManager(wsUrl.value)

  // 处理连接状态变化
  const handleConnectionChange = (connected: boolean) => {
    isConnected.value = connected
  }

  // 处理消息
  const handleMessage = (message: any) => {
    // 更新订阅状态
    if (message.type === 'subscriptionConfirmed' && message.data?.subscribedTypes) {
      subscribedTypes.value = message.data.subscribedTypes
    }

    // 忽略 ping/pong 消息
    if (message.type !== 'ping' && message.type !== 'pong') {
      // 添加到最近消息
      recentMessages.value.unshift({
        ...message,
        timestamp: message.timestamp || Date.now(),
      })

      // 限制消息数量
      if (recentMessages.value.length > 10) {
        recentMessages.value.pop()
      }
    }

    lastUpdate.value = Date.now()
  }

  // 添加处理器
  manager.addConnectionHandler(handleConnectionChange)
  manager.addMessageHandler(handleMessage)

  // 如果已经连接，更新状态
  isConnected.value = manager.isConnected
  subscribedTypes.value = manager.subscribedTypes

  // 组件卸载时清理
  onUnmounted(() => {
    manager.removeConnectionHandler(handleConnectionChange)
    manager.removeMessageHandler(handleMessage)
  })
})
</script>

<style scoped>
.maicraft-next-home {
  padding: 20px;
  height: 100%;
  overflow-y: auto;
}

.header {
  margin-bottom: 20px;
}

.title {
  display: flex;
  align-items: center;
  font-size: 28px;
  font-weight: 600;
  color: #303133;
  margin: 0;
}

.title-icon {
  margin-right: 10px;
  font-size: 32px;
  color: #409eff;
}

.status-row {
  margin-bottom: 20px;
}

.status-card {
  height: 100%;
}

.card-header {
  display: flex;
  align-items: center;
  gap: 8px;
  font-weight: 600;
}

.status-content {
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 10px 0;
}

.status-indicator {
  display: flex;
  align-items: center;
  gap: 10px;
  font-size: 18px;
  font-weight: 500;
}

.status-dot {
  width: 16px;
  height: 16px;
  border-radius: 50%;
  animation: pulse 2s infinite;
}

.connected .status-dot {
  background: #67c23a;
}

.disconnected .status-dot {
  background: #f56c6c;
  animation: none;
}

.connected .status-text {
  color: #67c23a;
}

.disconnected .status-text {
  color: #f56c6c;
}

.subscription-info {
  width: 100%;
}

.info-label {
  margin: 0 0 10px 0;
  font-weight: 500;
  color: #606266;
}

.subscription-tags {
  display: flex;
  flex-wrap: wrap;
  gap: 5px;
}

.update-info {
  text-align: center;
}

.update-time {
  margin: 0 0 5px 0;
  font-size: 24px;
  font-weight: 600;
  color: #409eff;
}

.update-timestamp {
  margin: 0;
  font-size: 14px;
  color: #909399;
}

.quick-actions-card,
.info-card,
.messages-card {
  margin-bottom: 20px;
}

.quick-actions {
  display: flex;
  gap: 10px;
}

.server-info {
  padding: 10px 0;
}

.messages-list {
  max-height: 400px;
  overflow-y: auto;
}

.empty-messages {
  display: flex;
  align-items: center;
  justify-content: center;
  min-height: 200px;
}

.message-items {
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.message-item {
  padding: 10px;
  background: #f5f7fa;
  border-radius: 4px;
  border: 1px solid #e4e7ed;
}

.message-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 8px;
}

.message-time {
  font-size: 12px;
  color: #909399;
}

.message-content {
  font-family: 'Courier New', monospace;
  font-size: 12px;
}

.message-content pre {
  margin: 0;
  white-space: pre-wrap;
  word-break: break-word;
}

.mt-3 {
  margin-top: 12px;
}

.mr-1 {
  margin-right: 4px;
}

.mb-1 {
  margin-bottom: 4px;
}

.ml-auto {
  margin-left: auto;
}

@keyframes pulse {
  0%,
  100% {
    opacity: 1;
  }
  50% {
    opacity: 0.5;
  }
}
</style>

