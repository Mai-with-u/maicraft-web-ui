# Memory 组件库

这个目录包含了用于显示和管理记忆数据的 Vue 组件。这些组件参考了日志查看器的设计，提供了统一、美观和易用的界面。

## 组件列表

### MemoryViewer.vue
主记忆查看器组件，提供完整的记忆查看功能。

**特性：**
- 支持外部数据源模式
- 记忆类型和重要性筛选
- 搜索功能
- 统计面板
- 自动滚动
- 详情查看

**Props:**
- `title`: 标题（默认：'记忆查看器'）
- `externalMemories`: 外部记忆数据
- `externalConnected`: 外部连接状态
- `maxMemories`: 最大记忆数量（默认：1000）
- `autoScroll`: 是否自动滚动（默认：true）

**Events:**
- `connect`: 请求连接
- `disconnect`: 断开连接
- `queryMemory`: 查询记忆
- `addMemory`: 添加记忆
- `clearMemories`: 清空记忆列表
- `deleteMemory`: 删除记忆

### MemoryControls.vue
记忆控制栏组件，提供操作按钮。

**Props:**
- `isConnected`: 连接状态
- `statsVisible`: 统计面板可见性
- `autoScrollEnabled`: 自动滚动状态

**Events:**
- `toggleConnection`: 切换连接
- `queryMemory`: 查询记忆
- `addMemory`: 添加记忆
- `clearMemories`: 清空记忆
- `toggleStats`: 切换统计
- `toggleAutoScroll`: 切换自动滚动

### MemoryStats.vue
记忆统计面板组件，显示统计信息。

**Props:**
- `visible`: 是否可见
- `typeStats`: 类型统计
- `importanceStats`: 重要性统计
- `totalMemories`: 总记忆数
- `memories`: 记忆数组

### MemoryEntry.vue
单条记忆显示组件。

**Props:**
- `memory`: 记忆数据
- `lineNumber`: 行号
- `expanded`: 是否展开

**Events:**
- `toggleExpand`: 切换展开
- `viewDetail`: 查看详情
- `delete`: 删除

## 使用示例

```vue
<template>
  <MemoryViewer
    title="我的记忆查看器"
    :external-memories="memories"
    :external-connected="isConnected"
    @connect="handleConnect"
    @disconnect="handleDisconnect"
    @query-memory="handleQueryMemory"
    @add-memory="handleAddMemory"
    @clear-memories="handleClearMemories"
    @delete-memory="handleDeleteMemory"
  />
</template>

<script setup lang="ts">
import { MemoryViewer } from '@/components/memory'

// 实现你的逻辑...
</script>
```

## 数据结构

### MemoryEntry
```typescript
interface MemoryEntry {
  id: string
  timestamp: number
  memoryType: 'thought' | 'conversation' | 'decision' | 'experience'
  importance?: 'high' | 'normal' | 'low'
  content?: string       // 思维内容
  message?: string       // 对话内容
  intention?: string     // 决策意图
  result?: string        // 决策结果
  lesson?: string        // 经验教训
  context?: string | Record<string, unknown>
  confidence?: number
  occurrences?: number
}
```

## 设计理念

1. **复用性**: 组件可以在不同的上下文中复用
2. **一致性**: 与日志查看器保持一致的设计风格
3. **可扩展性**: 易于添加新功能
4. **性能**: 支持大量数据的高效显示
5. **用户体验**: 提供直观的交互和清晰的信息展示

## 新增功能

### Markdown 渲染支持
- **智能默认渲染**: 思维类型和经验类型的记忆条目默认启用 markdown 渲染
- **切换渲染模式**: 每个记忆条目都可以切换 markdown 渲染和原始文本显示
- **语法高亮**: 支持代码块语法高亮
- **完整 markdown 支持**: 支持标题、列表、链接、表格、引用等 markdown 语法

#### Markdown 渲染规则
- 思维类型（`thought`）和经验类型（`experience`）记忆：默认启用 markdown 渲染
- 其他类型（对话、决策）记忆：默认显示原始文本，可手动切换到 markdown 渲染

#### 渲染特性
- 代码语法高亮
- 表格支持
- 链接自动识别
- 引用块样式
- 行内代码样式

## 修复的问题

1. **数据解析问题**: 修复了查询记忆时后端返回的数据结构 `{ entries: { thought: [], ... } }` 无法正确解析到页面的问题
2. **UI 设计**: 重构了界面，使其更加清晰和美观
3. **功能整合**: 将分散的功能整合到统一的组件中
4. **代码组织**: 改进了代码结构，提高了可维护性
5. **内容展示**: 添加了 markdown 渲染支持，提升了思维类型记忆的可读性

