<template>
  <div class="controls">
    <!-- 自动滚动控制 -->
    <div class="auto-scroll-control">
      <el-button
        :type="autoScrollEnabled ? 'warning' : 'success'"
        :icon="autoScrollEnabled ? VideoPause : VideoPlay"
        @click="$emit('toggleAutoScroll')"
        size="small"
        :title="autoScrollEnabled ? '点击暂停自动滚动' : '点击开启自动滚动'"
      >
        {{ autoScrollEnabled ? '暂停滚动' : '自动滚动' }}
      </el-button>
    </div>

    <el-button
      :type="isConnected ? 'success' : 'primary'"
      :icon="isConnected ? VideoPause : VideoPlay"
      @click="$emit('toggleConnection')"
      size="small"
    >
      {{ isConnected ? '断开连接' : '连接服务器' }}
    </el-button>
    
    <el-button 
      type="success" 
      icon="Search" 
      @click="$emit('queryMemory')" 
      :disabled="!isConnected"
      size="small"
    >
      查询记忆
    </el-button>
    
    <el-button 
      type="primary" 
      icon="Plus" 
      @click="$emit('addMemory')" 
      :disabled="!isConnected"
      size="small"
    >
      添加记忆
    </el-button>
    
    <el-button 
      type="info" 
      icon="Refresh" 
      @click="$emit('clearMemories')" 
      size="small"
    >
      清空列表
    </el-button>
    
    <el-button
      type="primary"
      :icon="statsVisible ? 'ArrowUp' : 'ArrowDown'"
      @click="$emit('toggleStats')"
      size="small"
    >
      {{ statsVisible ? '隐藏统计' : '显示统计' }}
    </el-button>
  </div>
</template>

<script setup lang="ts">
import { VideoPlay, VideoPause } from '@element-plus/icons-vue'

// Props定义
interface Props {
  isConnected: boolean
  statsVisible: boolean
  autoScrollEnabled: boolean
}

const props = withDefaults(defineProps<Props>(), {
  isConnected: false,
  statsVisible: false,
  autoScrollEnabled: true,
})

// 定义组件名称
defineOptions({
  name: 'MemoryControls',
})

// 事件定义
defineEmits<{
  toggleConnection: []
  queryMemory: []
  addMemory: []
  clearMemories: []
  toggleStats: []
  toggleAutoScroll: []
}>()
</script>

<style scoped>
.controls {
  display: flex;
  gap: 10px;
  align-items: center;
  flex-wrap: wrap;
}

.auto-scroll-control {
  margin-right: 10px;
}
</style>

