import { defineStore } from 'pinia'
import { ref, computed, readonly } from 'vue'
import {
  getMaicraftNextWebSocketManager,
  connectMaicraftNext,
  disconnectMaicraftNext,
  subscribeMaicraftNext,
  unsubscribeMaicraftNext,
} from '../services/maicraftNextWebSocket'
import type { MaicraftNextDataType } from '../types/maicraft-next'

// Maicraft-Next 连接状态接口
interface MaicraftNextState {
  isConnected: boolean
  isConnecting: boolean
  subscribedTypes: string[]
  lastUpdate: number
  error: string | null
  connectionUrl: string
}

// 数据类型订阅记录
interface SubscriptionRecord {
  dataTypes: string[]
  updateInterval: number
  filters?: Record<string, any>
  timestamp: number
}

export const useMaicraftNextStore = defineStore('maicraftNext', () => {
  // 响应式状态
  const state = ref<MaicraftNextState>({
    isConnected: false,
    isConnecting: false,
    subscribedTypes: [],
    lastUpdate: 0,
    error: null,
    connectionUrl: 'ws://localhost:25114/ws',
  })

  // 订阅记录，用于跟踪哪些组件订阅了哪些数据
  const subscriptionRecords = ref<Map<string, SubscriptionRecord>>(new Map())

  // WebSocket管理器实例
  let wsManager: ReturnType<typeof getMaicraftNextWebSocketManager> | null = null

  // 计算属性
  const isConnected = computed(() => state.value.isConnected)
  const isConnecting = computed(() => state.value.isConnecting)
  const subscribedTypes = computed(() => state.value.subscribedTypes)
  const connectionStatus = computed(() => {
    if (state.value.isConnecting) return 'connecting'
    if (state.value.isConnected) return 'connected'
    return 'disconnected'
  })

  // 获取WebSocket管理器
  const getWSManager = () => {
    if (!wsManager) {
      wsManager = getMaicraftNextWebSocketManager(state.value.connectionUrl)

      // 设置连接状态监听器
      wsManager.addConnectionHandler((connected) => {
        state.value.isConnected = connected
        state.value.isConnecting = false
        if (connected) {
          state.value.error = null
        }
      })

      // 设置消息监听器（用于更新最后活动时间）
      wsManager.addMessageHandler(() => {
        state.value.lastUpdate = Date.now()
      })
    }
    return wsManager
  }

  // 连接到Maicraft-Next服务器
  const connect = async (url?: string) => {
    if (state.value.isConnecting || state.value.isConnected) {
      return
    }

    state.value.isConnecting = true
    state.value.error = null

    try {
      if (url) {
        state.value.connectionUrl = url
        // 如果URL改变，需要重新创建管理器
        if (wsManager) {
          wsManager.disconnect()
          wsManager = null
        }
      }

      connectMaicraftNext(url)
      // 等待连接建立（实际连接状态会通过监听器更新）
      await new Promise((resolve) => setTimeout(resolve, 1000))
    } catch (error) {
      state.value.error = error instanceof Error ? error.message : '连接失败'
      state.value.isConnecting = false
      throw error
    }
  }

  // 断开连接
  const disconnect = () => {
    if (wsManager) {
      wsManager.disconnect()
    }
    state.value.isConnected = false
    state.value.isConnecting = false
    state.value.subscribedTypes = []
    subscriptionRecords.value.clear()
  }

  // 订阅数据类型
  const subscribe = (
    componentId: string,
    dataTypes: string[],
    updateInterval = 0,
    filters?: Record<string, any>,
  ) => {
    // 记录订阅信息
    subscriptionRecords.value.set(componentId, {
      dataTypes,
      updateInterval,
      filters,
      timestamp: Date.now(),
    })

    // 发送订阅请求
    const success = subscribeMaicraftNext(dataTypes, updateInterval, filters)
    if (success) {
      // 更新全局订阅状态（合并所有组件的订阅）
      updateGlobalSubscriptions()
    }
    return success
  }

  // 取消订阅数据类型
  const unsubscribe = (componentId: string, dataTypes?: string[]) => {
    if (dataTypes) {
      // 只取消指定的数据类型
      subscriptionRecords.value.delete(componentId)
    } else {
      // 取消组件的所有订阅
      subscriptionRecords.value.delete(componentId)
    }

    // 更新全局订阅状态
    updateGlobalSubscriptions()
  }

  // 更新全局订阅状态（合并所有活跃的订阅）
  const updateGlobalSubscriptions = () => {
    const allSubscribedTypes = new Set<string>()

    // 收集所有组件订阅的数据类型
    for (const record of subscriptionRecords.value.values()) {
      record.dataTypes.forEach((type) => allSubscribedTypes.add(type))
    }

    state.value.subscribedTypes = Array.from(allSubscribedTypes)

    // 如果没有活跃订阅，取消所有WebSocket订阅
    if (allSubscribedTypes.size === 0) {
      unsubscribeMaicraftNext(['memory', 'logs', 'player', 'world', 'tasks', 'usage'])
    }
  }

  // 获取组件的订阅状态
  const getComponentSubscriptions = (componentId: string) => {
    return subscriptionRecords.value.get(componentId)
  }

  // 检查是否订阅了特定数据类型
  const isSubscribed = (dataType: string) => {
    return state.value.subscribedTypes.includes(dataType)
  }

  // 添加消息处理器（组件级别）
  const addMessageHandler = (componentId: string, handler: (message: any) => void) => {
    const manager = getWSManager()
    manager.addMessageHandler(handler)

    // 返回清理函数
    return () => {
      manager.removeMessageHandler(handler)
    }
  }

  // 移除消息处理器
  const removeMessageHandler = (componentId: string, handler: (message: any) => void) => {
    if (wsManager) {
      wsManager.removeMessageHandler(handler)
    }
  }

  // 重置状态
  const reset = () => {
    disconnect()
    state.value = {
      isConnected: false,
      isConnecting: false,
      subscribedTypes: [],
      lastUpdate: 0,
      error: null,
      connectionUrl: 'ws://localhost:25114/ws',
    }
    subscriptionRecords.value.clear()
  }

  return {
    // 状态
    state: readonly(state),
    isConnected,
    isConnecting,
    subscribedTypes,
    connectionStatus,

    // 方法
    connect,
    disconnect,
    subscribe,
    unsubscribe,
    isSubscribed,
    getComponentSubscriptions,
    addMessageHandler,
    removeMessageHandler,
    reset,
  }
})

// 类型定义
export type { MaicraftNextState, SubscriptionRecord }
