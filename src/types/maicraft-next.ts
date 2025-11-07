/**
 * Maicraft-Next API 类型定义
 * 基于 maicraft-next/docs/api/api.md
 */

// 数据类型枚举
export enum MaicraftNextDataType {
  PLAYER = 'player',
  WORLD = 'world',
  LOGS = 'logs',
  TASKS = 'tasks',
  MEMORY = 'memory',
  USAGE = 'usage',
}

// WebSocket 消息接口
export interface MaicraftNextWSMessage {
  type: string
  timestamp?: number
  data?: any
  [key: string]: any
}

// 订阅消息接口
export interface MaicraftNextSubscriptionMessage {
  type: 'subscribe' | 'unsubscribe'
  dataTypes: string[] // ["player", "world", "logs"]
  updateInterval?: number // 0表示事件驱动，>0表示定期推送
  filters?: Record<string, any> // 可选的过滤条件
}

// 订阅确认消息
export interface MaicraftNextSubscriptionConfirmed extends MaicraftNextWSMessage {
  type: 'subscriptionConfirmed'
  data: {
    subscribedTypes: string[]
    updateInterval: number
    filters?: Record<string, any>
  }
}

// 心跳消息
export interface MaicraftNextPingMessage extends MaicraftNextWSMessage {
  type: 'ping'
  timestamp: number
}

export interface MaicraftNextPongMessage extends MaicraftNextWSMessage {
  type: 'pong'
  timestamp: number
  serverTimestamp: number
}

// 日志消息接口
export interface MaicraftNextLogMessage extends MaicraftNextWSMessage {
  type: 'logsUpdate'
  data: {
    timestamp: number
    level: string
    message: string
    module?: string
    [key: string]: any
  }
}

// 错误消息接口
export interface MaicraftNextErrorMessage extends MaicraftNextWSMessage {
  type: 'error'
  errorCode: string
  message: string
  timestamp: number
}

// API 响应接口
export interface MaicraftNextAPIResponse {
  timestamp: number
  success: boolean
  message: string
  data?: any
}

// 错误码
export enum MaicraftNextErrorCode {
  INVALID_JSON = 'INVALID_JSON',
  UNKNOWN_MESSAGE_TYPE = 'UNKNOWN_MESSAGE_TYPE',
  SUBSCRIPTION_ERROR = 'SUBSCRIPTION_ERROR',
  CONNECTION_ERROR = 'CONNECTION_ERROR',
  INTERNAL_ERROR = 'INTERNAL_ERROR',
}
