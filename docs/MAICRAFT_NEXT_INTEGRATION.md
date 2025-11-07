# Maicraft-Next API 集成说明

## 概述

本文档描述了 `maicraft-web-ui` 项目中对 `maicraft-next` API 的集成。通过侧边栏的项目切换开关，用户可以在 Maicraft 和 Maicraft-Next 之间无缝切换。

## 新增功能

### 1. 项目切换功能

在侧边栏顶部新增了一个项目切换开关，支持在以下两个模式之间切换：

- **Maicraft 模式**（默认）：显示原有的完整菜单，包括 Agent 日志、MCP Server 日志、游戏状态、MCP 工具、Token 监控、任务管理、Agent 管理、调试工具等。
- **Maicraft-Next 模式**：显示简化的菜单，目前仅包含主页和日志查看器。

切换操作会自动跳转到对应项目的主页，并保持侧边栏菜单同步。

### 2. Maicraft-Next 专属页面

#### 主页 (`/maicraft-next`)

提供以下功能：

- **连接状态监控**：实时显示 WebSocket 连接状态
- **订阅状态管理**：显示当前已订阅的数据类型
- **快速操作**：
  - 订阅所有数据类型
  - 取消所有订阅
  - 跳转到日志查看器
- **服务器信息**：显示 WebSocket 地址、心跳间隔、自动重连配置等
- **实时消息**：显示最近收到的 10 条消息（不包括 ping/pong）

#### 日志查看器 (`/maicraft-next/logs`)

**复用 Maicraft 的日志查看器组件**，提供完整的功能：

- **日志展示**：实时显示来自 Maicraft-Next 的日志，支持日志合并
- **日志筛选**：
  - 按级别筛选（TRACE、DEBUG、INFO、SUCCESS、WARNING、ERROR、CRITICAL）
  - 按模块筛选，支持多选和搜索
  - 按内容搜索，支持正则表达式
- **连接管理**：连接/断开 WebSocket
- **自动滚动**：智能自动滚动，可手动控制
- **清空日志**：清空当前显示的日志
- **统计信息**：
  - 日志级别统计
  - 模块统计
  - 日志频率统计
- **日志详情**：点击展开查看完整日志信息
- **导航功能**：快速跳转到顶部/底部

## 技术实现

### 组件复用

Maicraft-Next 的日志查看器完全复用了 Maicraft 的 `LogViewer` 组件，通过以下方式实现：

1. **外部模式支持**：在 `LogViewer` 组件中添加了 `externalMode` prop
2. **外部数据源**：通过 `externalLogs` prop 传入日志数据
3. **外部连接状态**：通过 `externalConnected` prop 传入连接状态
4. **事件回调**：通过 `@connect`、`@disconnect`、`@clear-logs` 事件处理外部操作

这种设计保证了：
- **UI 一致性**：两个项目的日志查看器界面和功能完全一致
- **代码复用**：避免重复实现相同的功能
- **易于维护**：只需要维护一个日志查看器组件

### 1. WebSocket 服务 (`maicraftNextWebSocket.ts`)

基于 Maicraft-Next API 的订阅机制实现：

- **单一端点**：`ws://localhost:25114/ws`
- **订阅机制**：支持订阅多种数据类型（player, world, logs, tasks, memory, usage）
- **心跳机制**：默认 30 秒发送一次 ping 消息
- **自动重连**：最多重试 5 次，每次间隔 5 秒
- **消息处理**：支持添加自定义消息处理器、连接状态处理器、错误处理器等

### 2. 类型定义 (`maicraft-next.ts`)

定义了 Maicraft-Next API 相关的 TypeScript 类型：

- `MaicraftNextDataType`：数据类型枚举
- `MaicraftNextWSMessage`：通用 WebSocket 消息接口
- `MaicraftNextSubscriptionMessage`：订阅消息接口
- `MaicraftNextLogMessage`：日志消息接口
- `MaicraftNextErrorMessage`：错误消息接口
- 其他类型定义

### 3. 路由配置

新增路由：

```typescript
{
  path: '/maicraft-next',
  name: 'maicraft-next-home',
  component: MaicraftNextHome,
}
{
  path: '/maicraft-next/logs',
  name: 'maicraft-next-logs',
  component: MaicraftNextLogViewer,
}
```

### 4. 侧边栏改进

- 使用 `v-if`/`v-else` 控制两个独立的菜单显示
- 自动根据当前路由切换项目模式
- 路由变化时自动同步侧边栏状态

## API 对比

### Maicraft (原项目)

- **多端点架构**：每个功能模块使用独立的 WebSocket 端点
- **订阅方式**：发送 `subscribe` 消息，指定 `update_interval`
- **心跳间隔**：10 秒
- **端点示例**：
  - `/ws/game/player`
  - `/ws/game/world`
  - `/ws/logs`
  - `/ws/token-usage`
  - `/ws/tasks`

### Maicraft-Next (新项目)

- **单一端点架构**：所有功能共用一个 WebSocket 端点 `/ws`
- **订阅方式**：发送 `subscribe` 消息，包含 `dataTypes` 数组、`updateInterval` 和可选的 `filters`
- **心跳间隔**：30 秒（建议）
- **数据类型**：player, world, logs, tasks, memory, usage

## 使用方法

### 1. 启动 Maicraft-Next 服务

确保 Maicraft-Next 服务正在运行，默认地址为 `ws://localhost:25114/ws`。

### 2. 切换到 Maicraft-Next 模式

1. 在侧边栏顶部找到项目切换开关
2. 将开关切换到 "Maicraft-Next" 模式
3. 页面会自动跳转到 Maicraft-Next 主页

### 3. 连接到服务器

在主页或日志查看器页面：

1. 点击"连接服务器"或"连接"按钮
2. 等待连接建立
3. 连接成功后，可以开始订阅数据

### 4. 订阅日志

在日志查看器页面：

1. 确保已连接到服务器
2. 日志查看器会自动订阅 `logs` 数据类型
3. 日志会实时显示在页面上

或者在主页：

1. 点击"订阅所有数据"按钮订阅所有可用的数据类型
2. 在"实时消息"区域查看收到的消息

## 配置

如果 Maicraft-Next 服务使用的不是默认地址，可以修改以下文件：

### WebSocket URL 配置

在 `src/services/maicraftNextWebSocket.ts` 中修改默认 URL：

```typescript
export const getMaicraftNextWebSocketManager = (url?: string): MaicraftNextWebSocketManager => {
  if (!globalMaicraftNextWS) {
    const wsUrl = url || 'ws://localhost:25114/ws' // 修改此处
    // ...
  }
  // ...
}
```

或者在组件中传入自定义 URL：

```typescript
connectMaicraftNext('ws://your-server:port/ws')
```

## 未来扩展

当 Maicraft-Next 提供更多功能模块时，可以轻松扩展侧边栏菜单和页面：

1. 在 `src/views/` 目录下创建新的页面组件
2. 在 `src/router/index.ts` 中添加新的路由
3. 在 `src/components/Sidebar.vue` 的 Maicraft-Next 菜单中添加新的菜单项
4. 使用 `maicraftNextWebSocket.ts` 服务订阅相应的数据类型

## 注意事项

1. **不破坏原有功能**：Maicraft-Next 的集成不会影响原有 Maicraft 的任何功能，两者完全独立。
2. **WebSocket 连接**：切换项目模式不会自动断开当前的 WebSocket 连接，需要手动管理。
3. **数据隔离**：两个项目的数据和状态是完全隔离的，不会相互影响。
4. **路由独立**：Maicraft-Next 的路由都以 `/maicraft-next` 开头，与原有路由不冲突。

## 问题排查

### WebSocket 连接失败

1. 检查 Maicraft-Next 服务是否正在运行
2. 检查 WebSocket URL 是否正确
3. 检查浏览器控制台是否有错误信息
4. 检查网络连接和防火墙设置

### 日志不显示

1. 确保已成功连接到服务器
2. 确保已订阅 `logs` 数据类型
3. 检查日志级别筛选是否正确
4. 检查浏览器控制台是否有消息接收
5. **注意**：服务端推送的日志消息类型是 `logsUpdate`，不是 `logs`

### 侧边栏切换异常

1. 清除浏览器缓存
2. 检查浏览器控制台是否有 JavaScript 错误
3. 尝试刷新页面

## 重要说明

### 消息类型

根据 Maicraft-Next API 文档，不同数据类型的推送消息有不同的 `type`：

- 订阅确认：`subscriptionConfirmed`
- 日志推送：`logsUpdate`（注意不是 `logs`）
- 玩家数据：待确认
- 世界数据：待确认
- 任务数据：待确认
- 记忆数据：待确认
- 使用统计：待确认

### 订阅和推送的区别

- **订阅时**：在 `dataTypes` 数组中使用 `"logs"`, `"player"` 等
- **推送时**：服务端发送的消息 `type` 为 `"logsUpdate"`, `"playerUpdate"` 等（加了 `Update` 后缀）

## 参考文档

- [Maicraft-Next API 文档](../maicraft-next/docs/api/api.md)
- [日志接口文档](../maicraft-next/docs/api/logs.md)

