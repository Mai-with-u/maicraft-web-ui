<template>
  <div v-if="visible" class="stats-panel">
    <div class="stats-section">
      <h3>记忆类型统计</h3>
      <div class="stats-grid">
        <div v-for="(count, type) in typeStats" :key="type" class="stat-item">
          <span class="stat-label" :class="`type-${type}`">{{ getTypeLabel(String(type)) }}</span>
          <span class="stat-value">{{ count }}</span>
        </div>
      </div>
    </div>

    <div class="stats-section">
      <h3>重要性统计</h3>
      <div class="stats-grid">
        <div v-for="(count, importance) in importanceStats" :key="importance" class="stat-item">
          <span class="stat-label" :class="`importance-${importance}`">{{ getImportanceLabel(String(importance)) }}</span>
          <span class="stat-value">{{ count }}</span>
        </div>
      </div>
    </div>

    <div class="stats-section">
      <h3>总体信息</h3>
      <div class="stats-info">
        <div class="info-item">
          <span class="info-label">总记忆数:</span>
          <span class="info-value">{{ totalMemories }}</span>
        </div>
        <div class="info-item">
          <span class="info-label">每分钟频率:</span>
          <span class="info-value">{{ getMemoryFrequency() }}/min</span>
        </div>
        <div class="info-item">
          <span class="info-label">最新记忆:</span>
          <span class="info-value">{{ getLatestMemoryTime() }}</span>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
// Props定义
interface Props {
  visible: boolean
  typeStats: Record<string, number>
  importanceStats: Record<string, number>
  totalMemories: number
  memories: Array<{
    timestamp: number
    memoryType: string
  }>
}

const props = withDefaults(defineProps<Props>(), {
  visible: false,
  typeStats: () => ({}),
  importanceStats: () => ({}),
  totalMemories: 0,
  memories: () => [],
})

// 定义组件名称
defineOptions({
  name: 'MemoryStats',
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

const getImportanceLabel = (importance: string) => {
  const labels: Record<string, string> = {
    high: '高',
    normal: '正常',
    low: '低',
  }
  return labels[importance] || importance
}

// 计算记忆频率（每分钟）
const getMemoryFrequency = (): number => {
  const now = Date.now()
  const oneMinuteAgo = now - 60000

  const recentMemories = props.memories.filter((memory) => {
    return memory.timestamp > oneMinuteAgo
  })

  return recentMemories.length
}

// 获取最新记忆时间
const getLatestMemoryTime = (): string => {
  if (props.memories.length === 0) return '无'
  
  const latest = props.memories.reduce((latest, memory) => {
    return memory.timestamp > latest.timestamp ? memory : latest
  }, props.memories[0])
  
  const diff = Date.now() - latest.timestamp
  if (diff < 1000) return '刚刚'
  if (diff < 60000) return `${Math.floor(diff / 1000)}秒前`
  if (diff < 3600000) return `${Math.floor(diff / 60000)}分钟前`
  return `${Math.floor(diff / 3600000)}小时前`
}
</script>

<style scoped>
.stats-panel {
  background: white;
  border-radius: 8px;
  padding: 16px 20px;
  margin-bottom: 20px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

.stats-section {
  margin-bottom: 20px;
}

.stats-section:last-child {
  margin-bottom: 0;
}

.stats-section h3 {
  margin: 0 0 12px 0;
  font-size: 16px;
  color: #333;
  border-bottom: 2px solid #409eff;
  padding-bottom: 4px;
}

.stats-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
  gap: 12px;
}

.stat-item {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 8px 12px;
  background: #f8f9fa;
  border-radius: 6px;
  border-left: 3px solid #409eff;
}

.stat-label {
  font-weight: 500;
  color: #333;
  flex: 1;
}

.type-thought {
  color: #409eff;
}

.type-conversation {
  color: #67c23a;
}

.type-decision {
  color: #e6a23c;
}

.type-experience {
  color: #909399;
}

.importance-high {
  color: #f56c6c;
}

.importance-normal {
  color: #e6a23c;
}

.importance-low {
  color: #909399;
}

.stat-value {
  font-weight: bold;
  color: #409eff;
  font-size: 14px;
}

.stats-info {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(150px, 1fr));
  gap: 12px;
}

.info-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 8px 12px;
  background: #f0f9ff;
  border-radius: 6px;
}

.info-label {
  color: #666;
  font-size: 14px;
}

.info-value {
  font-weight: bold;
  color: #409eff;
}
</style>

