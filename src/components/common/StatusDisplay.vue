<template>
  <div class="status-display" :class="sizeClass">
    <div v-for="item in items" :key="item.key" class="status-item" :class="item.class">
      <div class="status-label">{{ item.label }}</div>
      <div class="status-value" :style="item.valueStyle">{{ item.value }}</div>
      <div v-if="item.description" class="status-description">{{ item.description }}</div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'

interface StatusItem {
  key: string
  label: string
  value: string | number
  description?: string
  class?: string
  valueStyle?: Record<string, string>
}

interface Props {
  items: StatusItem[]
  size?: 'small' | 'medium' | 'large'
  columns?: number
}

const props = withDefaults(defineProps<Props>(), {
  size: 'medium',
  columns: 0, // 0 表示自动适应
})

// 计算尺寸类名
const sizeClass = computed(() => {
  switch (props.size) {
    case 'small':
      return 'status-display-small'
    case 'large':
      return 'status-display-large'
    default:
      return ''
  }
})

defineOptions({
  name: 'StatusDisplay',
})
</script>

<style scoped>
/* 不同尺寸的status-item内边距 */
.status-display-small .status-item {
  padding: 12px;
}

.status-display-large .status-item {
  padding: 24px;
}
</style>
