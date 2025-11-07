/**
 * Maicraft-Next WebSocket 服务
 * 基于单一端点 /ws 和订阅机制
 */
import { reactive, ref } from 'vue'
import type {
  MaicraftNextDataType,
  MaicraftNextWSMessage,
  MaicraftNextSubscriptionMessage,
  MaicraftNextPingMessage,
  MaicraftNextPongMessage,
} from '../types/maicraft-next'

// WebSocket 连接配置
export interface MaicraftNextWSConfig {
  url: string
  heartbeatInterval?: number // 心跳间隔（毫秒）
  reconnectInterval?: number // 重连间隔（毫秒）
  maxReconnectAttempts?: number // 最大重连次数
  autoReconnect?: boolean // 是否自动重连
}

// WebSocket 连接状态
export interface MaicraftNextConnectionState {
  isConnected: boolean
  lastMessage: any
  lastUpdate: number
  error: string | null
  subscribedTypes: string[]
}

// Maicraft-Next WebSocket 管理器
export class MaicraftNextWebSocketManager {
  private ws: WebSocket | null = null
  private heartbeatTimer: number | null = null
  private reconnectTimer: number | null = null
  private reconnectAttempts = 0

  public connection: MaicraftNextConnectionState = reactive({
    isConnected: false,
    lastMessage: null,
    lastUpdate: 0,
    error: null,
    subscribedTypes: [],
  })

  private config: Required<MaicraftNextWSConfig>
  private id: string

  private messageHandlers: ((message: any) => void)[] = []
  private connectionHandlers: ((connected: boolean) => void)[] = []
  private errorHandlers: ((error: Event) => void)[] = []
  private closeHandlers: (() => void)[] = []

  constructor(id: string, config: MaicraftNextWSConfig) {
    this.id = id
    this.config = {
      url: config.url,
      heartbeatInterval: config.heartbeatInterval || 30000, // 默认30秒
      reconnectInterval: config.reconnectInterval || 5000,
      maxReconnectAttempts: config.maxReconnectAttempts || 5,
      autoReconnect: config.autoReconnect !== false,
    }
  }

  // 获取管理器ID
  getId() {
    return this.id
  }

  // 连接WebSocket
  connect() {
    if (this.ws && this.ws.readyState === WebSocket.OPEN) {
      console.log(`[${this.id}] WebSocket already connected`)
      return
    }

    try {
      console.log(`[${this.id}] Connecting to ${this.config.url}`)
      this.ws = new WebSocket(this.config.url)

      this.ws.onopen = () => {
        this.connection.isConnected = true
        this.connection.error = null
        this.reconnectAttempts = 0
        console.log(`[${this.id}] WebSocket connected`)

        // 启动心跳
        this.startHeartbeat()

        // 触发连接事件
        this.connectionHandlers.forEach((handler) => handler(true))
      }

      this.ws.onmessage = (event) => {
        try {
          const data = JSON.parse(event.data)
          this.connection.lastMessage = data
          this.connection.lastUpdate = Date.now()

          // 处理订阅确认消息
          if (data.type === 'subscriptionConfirmed' && data.data?.subscribedTypes) {
            this.connection.subscribedTypes = data.data.subscribedTypes
          }

          // 触发消息处理器
          this.messageHandlers.forEach((handler) => handler(data))
        } catch (error) {
          console.error(`[${this.id}] Failed to parse WebSocket message:`, error)
        }
      }

      this.ws.onclose = () => {
        this.connection.isConnected = false
        console.log(`[${this.id}] WebSocket disconnected`)

        // 停止心跳
        this.stopHeartbeat()

        // 触发关闭事件
        this.connectionHandlers.forEach((handler) => handler(false))
        this.closeHandlers.forEach((handler) => handler())

        // 自动重连
        if (this.config.autoReconnect && this.reconnectAttempts < this.config.maxReconnectAttempts) {
          this.reconnectAttempts++
          console.log(
            `[${this.id}] Reconnecting... (${this.reconnectAttempts}/${this.config.maxReconnectAttempts})`,
          )
          this.reconnectTimer = window.setTimeout(() => {
            this.connect()
          }, this.config.reconnectInterval)
        }
      }

      this.ws.onerror = (error) => {
        console.error(`[${this.id}] WebSocket error:`, error)
        this.connection.error = 'WebSocket连接错误'
        this.errorHandlers.forEach((handler) => handler(error))
      }
    } catch (error) {
      console.error(`[${this.id}] Failed to create WebSocket:`, error)
      this.connection.error = '创建WebSocket连接失败'
    }
  }

  // 断开连接
  disconnect() {
    console.log(`[${this.id}] Disconnecting...`)

    // 清除定时器
    this.stopHeartbeat()
    if (this.reconnectTimer) {
      clearTimeout(this.reconnectTimer)
      this.reconnectTimer = null
    }

    // 关闭连接
    if (this.ws) {
      this.ws.close()
      this.ws = null
    }

    this.connection.isConnected = false
    this.connection.subscribedTypes = []
  }

  // 发送消息
  sendMessage(message: any): boolean {
    if (!this.ws || this.ws.readyState !== WebSocket.OPEN) {
      console.warn(`[${this.id}] WebSocket not ready, cannot send message`)
      return false
    }

    try {
      const messageString = JSON.stringify(message)
      this.ws.send(messageString)
      console.log(`[${this.id}] Message sent:`, message)
      return true
    } catch (error) {
      console.error(`[${this.id}] Failed to send message:`, error)
      return false
    }
  }

  // 订阅数据类型
  subscribe(dataTypes: string[], updateInterval = 0, filters?: Record<string, any>): boolean {
    const message: MaicraftNextSubscriptionMessage = {
      type: 'subscribe',
      dataTypes,
      updateInterval,
      filters,
    }
    return this.sendMessage(message)
  }

  // 取消订阅
  unsubscribe(dataTypes: string[]): boolean {
    const message: MaicraftNextSubscriptionMessage = {
      type: 'unsubscribe',
      dataTypes,
    }
    return this.sendMessage(message)
  }

  // 开始心跳
  private startHeartbeat() {
    console.log(`[${this.id}] Starting heartbeat (interval: ${this.config.heartbeatInterval}ms)`)

    // 清除可能存在的旧定时器
    if (this.heartbeatTimer) {
      clearInterval(this.heartbeatTimer)
      this.heartbeatTimer = null
    }

    this.heartbeatTimer = window.setInterval(() => {
      if (this.ws && this.ws.readyState === WebSocket.OPEN) {
        const pingMessage: MaicraftNextPingMessage = {
          type: 'ping',
          timestamp: Date.now(),
        }
        this.sendMessage(pingMessage)
      }
    }, this.config.heartbeatInterval)
  }

  // 停止心跳
  private stopHeartbeat() {
    if (this.heartbeatTimer) {
      console.log(`[${this.id}] Stopping heartbeat`)
      clearInterval(this.heartbeatTimer)
      this.heartbeatTimer = null
    }
  }

  // 添加消息处理器
  addMessageHandler(handler: (message: any) => void) {
    this.messageHandlers.push(handler)
  }

  // 移除消息处理器
  removeMessageHandler(handler: (message: any) => void) {
    const index = this.messageHandlers.indexOf(handler)
    if (index > -1) {
      this.messageHandlers.splice(index, 1)
    }
  }

  // 添加连接状态处理器
  addConnectionHandler(handler: (connected: boolean) => void) {
    this.connectionHandlers.push(handler)
  }

  // 移除连接状态处理器
  removeConnectionHandler(handler: (connected: boolean) => void) {
    const index = this.connectionHandlers.indexOf(handler)
    if (index > -1) {
      this.connectionHandlers.splice(index, 1)
    }
  }

  // 添加错误处理器
  addErrorHandler(handler: (error: Event) => void) {
    this.errorHandlers.push(handler)
  }

  // 移除错误处理器
  removeErrorHandler(handler: (error: Event) => void) {
    const index = this.errorHandlers.indexOf(handler)
    if (index > -1) {
      this.errorHandlers.splice(index, 1)
    }
  }

  // 添加关闭处理器
  addCloseHandler(handler: () => void) {
    this.closeHandlers.push(handler)
  }

  // 移除关闭处理器
  removeCloseHandler(handler: () => void) {
    const index = this.closeHandlers.indexOf(handler)
    if (index > -1) {
      this.closeHandlers.splice(index, 1)
    }
  }

  // 获取连接状态
  get isConnected() {
    return this.connection.isConnected
  }

  // 获取最后更新时间
  get lastUpdate() {
    return this.connection.lastUpdate
  }

  // 获取最后消息
  get lastMessage() {
    return this.connection.lastMessage
  }

  // 获取已订阅的数据类型
  get subscribedTypes() {
    return this.connection.subscribedTypes
  }
}

// =============================================
// 全局 Maicraft-Next WebSocket 管理
// =============================================

// 全局管理器实例
let globalMaicraftNextWS: MaicraftNextWebSocketManager | null = null

// 获取或创建全局管理器
export const getMaicraftNextWebSocketManager = (url?: string): MaicraftNextWebSocketManager => {
  if (!globalMaicraftNextWS) {
    const wsUrl = url || 'ws://localhost:25114/ws'
    globalMaicraftNextWS = new MaicraftNextWebSocketManager('maicraft-next', {
      url: wsUrl,
      heartbeatInterval: 30000, // 30秒心跳
      reconnectInterval: 5000,
      maxReconnectAttempts: 5,
      autoReconnect: true,
    })
  }
  return globalMaicraftNextWS
}

// 连接到 Maicraft-Next
export const connectMaicraftNext = (url?: string) => {
  const manager = getMaicraftNextWebSocketManager(url)
  manager.connect()
}

// 断开 Maicraft-Next 连接
export const disconnectMaicraftNext = () => {
  if (globalMaicraftNextWS) {
    globalMaicraftNextWS.disconnect()
  }
}

// 订阅数据类型
export const subscribeMaicraftNext = (
  dataTypes: string[],
  updateInterval = 0,
  filters?: Record<string, any>,
) => {
  if (globalMaicraftNextWS) {
    return globalMaicraftNextWS.subscribe(dataTypes, updateInterval, filters)
  }
  return false
}

// 取消订阅
export const unsubscribeMaicraftNext = (dataTypes: string[]) => {
  if (globalMaicraftNextWS) {
    return globalMaicraftNextWS.unsubscribe(dataTypes)
  }
  return false
}

// 获取连接状态
export const getMaicraftNextConnectionState = () => {
  if (globalMaicraftNextWS) {
    return globalMaicraftNextWS.connection
  }
  return null
}

