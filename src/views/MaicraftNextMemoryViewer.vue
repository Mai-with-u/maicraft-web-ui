<template>
  <!-- 
    复用 Memory 的 MemoryViewer 组件
    通过外部模式传入外部数据源和连接状态
    保持 UI 和功能的完全一致性
  -->
  <MemoryViewer
    title="Maicraft-Next 记忆查看器"
    :external-memories="memories"
    :external-connected="isConnected"
    :max-memories="1000"
    :auto-scroll="true"
    @connect="handleConnect"
    @disconnect="handleDisconnect"
    @query-memory="handleQueryMemory"
    @add-memory="handleAddMemory"
    @clear-memories="handleClearMemories"
    @delete-memory="handleDeleteMemory"
  />

  <!-- 添加记忆对话框 -->
  <el-dialog v-model="addDialogVisible" title="添加记忆" width="600px">
    <el-form :model="addForm" :rules="addFormRules" ref="addFormRef" label-width="80px">
      <el-form-item label="类型" prop="memoryType">
        <el-select v-model="addForm.memoryType" placeholder="选择记忆类型">
          <el-option label="思维" value="thought" />
          <el-option label="对话" value="conversation" />
          <el-option label="决策" value="decision" />
          <el-option label="经验" value="experience" />
        </el-select>
      </el-form-item>
      <el-form-item label="重要性" prop="importance">
        <el-select v-model="addForm.importance" placeholder="选择重要性">
          <el-option label="高" value="high" />
          <el-option label="正常" value="normal" />
          <el-option label="低" value="low" />
        </el-select>
      </el-form-item>
      <el-form-item :label="getContentLabel(addForm.memoryType)" prop="content">
        <el-input
          v-model="addForm.content"
          type="textarea"
          :rows="4"
          :placeholder="getContentPlaceholder(addForm.memoryType)"
        />
      </el-form-item>
      <el-form-item label="上下文" prop="context">
        <el-input
          v-model="addForm.context"
          type="textarea"
          :rows="2"
          placeholder="可选的上下文信息"
        />
      </el-form-item>
    </el-form>
    <template #footer>
      <el-button @click="addDialogVisible = false">取消</el-button>
      <el-button type="primary" @click="submitAddMemory" :loading="addLoading"> 添加 </el-button>
    </template>
  </el-dialog>

  <!-- 查询设置对话框 -->
  <el-dialog v-model="queryDialogVisible" title="查询记忆" width="500px">
    <el-form label-width="80px">
      <el-form-item label="记忆类型">
        <el-checkbox-group v-model="queryFilters.memoryTypes">
          <el-checkbox label="thought">思维</el-checkbox>
          <el-checkbox label="conversation">对话</el-checkbox>
          <el-checkbox label="decision">决策</el-checkbox>
          <el-checkbox label="experience">经验</el-checkbox>
        </el-checkbox-group>
      </el-form-item>
      <el-form-item label="重要性">
        <el-select v-model="queryFilters.importance" placeholder="选择重要性" clearable>
          <el-option label="高" value="high" />
          <el-option label="正常" value="normal" />
          <el-option label="低" value="low" />
        </el-select>
      </el-form-item>
      <el-form-item label="限制数量">
        <el-input-number v-model="queryFilters.limit" :min="1" :max="1000" />
      </el-form-item>
    </el-form>
    <template #footer>
      <el-button @click="queryDialogVisible = false">取消</el-button>
      <el-button type="primary" @click="submitQuery" :loading="isQuerying"> 查询 </el-button>
    </template>
  </el-dialog>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, onUnmounted, reactive } from 'vue'
import { MemoryViewer } from '../components/memory/index'
import { useMaicraftNextStore } from '../stores/maicraftNext'
import type { MaicraftNextWSMessage } from '../types/maicraft-next'
import { ElMessage, ElMessageBox } from 'element-plus'
import { getMaicraftNextWebSocketManager } from '../services/maicraftNextWebSocket'

// 定义组件名称
defineOptions({
  name: 'MaicraftNextMemoryViewer',
})

// 记忆条目接口
interface MemoryEntry {
  id: string
  timestamp: number
  memoryType: 'thought' | 'conversation' | 'decision' | 'experience'
  importance?: 'high' | 'normal' | 'low'
  content?: string
  message?: string
  intention?: string
  result?: string
  lesson?: string
  context?: string | Record<string, unknown>
  confidence?: number
  occurrences?: number
}

// 使用全局store
const maicraftNextStore = useMaicraftNextStore()

// 响应式数据
const memories = ref<MemoryEntry[]>([])

// 从store获取连接状态
const isConnected = computed(() => maicraftNextStore.isConnected)

// 查询相关
const queryDialogVisible = ref(false)
const isQuerying = ref(false)
const queryFilters = reactive({
  memoryTypes: ['thought', 'conversation', 'decision', 'experience'],
  importance: undefined as string | undefined,
  limit: 50,
})

// 添加记忆表单
const addDialogVisible = ref(false)
const addFormRef = ref()
const addLoading = ref(false)
const addForm = reactive({
  memoryType: 'thought' as 'thought' | 'conversation' | 'decision' | 'experience',
  importance: 'normal' as 'high' | 'normal' | 'low',
  content: '',
  context: '',
})

const addFormRules = {
  memoryType: [{ required: true, message: '请选择记忆类型', trigger: 'change' }],
  importance: [{ required: true, message: '请选择重要性', trigger: 'change' }],
  content: [{ required: true, message: '请输入内容', trigger: 'blur' }],
}

// 连接处理
const handleConnect = async () => {
  try {
    await maicraftNextStore.connect()
    // 订阅记忆数据
    maicraftNextStore.subscribe('memory-viewer', ['memory'], 0)
    ElMessage.success('连接成功')
  } catch (error) {
    console.error('连接失败:', error)
    ElMessage.error('连接失败')
  }
}

// 断开连接处理
const handleDisconnect = () => {
  maicraftNextStore.unsubscribe('memory-viewer')
  ElMessage.info('已取消记忆订阅')
}

// 查询记忆处理
const handleQueryMemory = () => {
  queryDialogVisible.value = true
}

// 提交查询
const submitQuery = () => {
  const queryMessage = {
    type: 'memory_query',
    data: {
      memoryTypes: queryFilters.memoryTypes,
      limit: queryFilters.limit,
      filters: {
        importance: queryFilters.importance,
      },
    },
  }

  const manager = getMaicraftNextWebSocketManager()
  const success = manager.sendMessage(queryMessage)
  if (success) {
    isQuerying.value = true
    queryDialogVisible.value = false
    ElMessage.success('已发送查询请求')
  } else {
    ElMessage.error('发送查询请求失败')
  }
}

// 添加记忆处理
const handleAddMemory = () => {
  addForm.memoryType = 'thought'
  addForm.importance = 'normal'
  addForm.content = ''
  addForm.context = ''
  addDialogVisible.value = true
}

// 提交添加记忆
const submitAddMemory = async () => {
  if (!addFormRef.value) return

  await addFormRef.value.validate(async (valid: boolean) => {
    if (valid) {
      addLoading.value = true
      try {
        const addMessage = {
          type: 'memory_add',
          data: {
            memoryType: addForm.memoryType,
            entry: {
              [getMemoryContentField(addForm.memoryType)]: addForm.content,
              importance: addForm.importance,
              context: addForm.context || undefined,
              timestamp: Date.now(),
            },
          },
        }

        const manager = getMaicraftNextWebSocketManager()
        const success = manager.sendMessage(addMessage)
        if (success) {
          ElMessage.success('已发送添加请求')
          addDialogVisible.value = false
        } else {
          ElMessage.error('发送添加请求失败')
        }
      } catch {
        ElMessage.error('添加失败')
      } finally {
        addLoading.value = false
      }
    }
  })
}

// 清空记忆列表处理
const handleClearMemories = () => {
  memories.value = []
}

// 删除记忆处理
const handleDeleteMemory = async (memory: MemoryEntry) => {
  try {
    await ElMessageBox.confirm(
      `确定要删除这条${getMemoryTypeLabel(memory.memoryType)}记忆吗？`,
      '确认删除',
      {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning',
      },
    )

    const deleteMessage = {
      type: 'memory_delete',
      data: {
        memoryType: memory.memoryType,
        id: memory.id,
      },
    }

    const manager = getMaicraftNextWebSocketManager()
    const success = manager.sendMessage(deleteMessage)
    if (success) {
      ElMessage.success('已发送删除请求')
    } else {
      ElMessage.error('发送删除请求失败')
    }
  } catch {
    // 用户取消删除
  }
}

// 工具函数
const getMemoryTypeLabel = (type: string) => {
  const labels: Record<string, string> = {
    thought: '思维',
    conversation: '对话',
    decision: '决策',
    experience: '经验',
  }
  return labels[type] || type
}

const getContentLabel = (type: string) => {
  const labels: Record<string, string> = {
    thought: '思维内容',
    conversation: '对话内容',
    decision: '决策内容',
    experience: '经验教训',
  }
  return labels[type] || '内容'
}

const getContentPlaceholder = (type: string) => {
  const placeholders: Record<string, string> = {
    thought: '输入AI的思维内容...',
    conversation: '输入对话内容...',
    decision: '输入决策内容...',
    experience: '输入经验教训...',
  }
  return placeholders[type] || '输入内容...'
}

const getMemoryContentField = (type: string) => {
  const fields: Record<string, string> = {
    thought: 'content',
    conversation: 'message',
    decision: 'intention',
    experience: 'lesson',
  }
  return fields[type] || 'content'
}

// 组件挂载
onMounted(() => {
  // 添加消息处理器
  const removeMessageHandler = maicraftNextStore.addMessageHandler(
    'memory-viewer',
    (message: MaicraftNextWSMessage) => {
      // 处理记忆推送
      if (message.type === 'memory_push' && message.data) {
        const memoryData = message.data
        if (memoryData.memoryType && memoryData.entry) {
          memories.value.push({
            ...memoryData.entry,
            memoryType: memoryData.memoryType,
          })

          // 限制记忆数量，避免内存溢出
          if (memories.value.length > 1000) {
            memories.value = memories.value.slice(-1000)
          }
        }
      }

      // 处理查询响应 - 修复数据解析问题
      if (message.type === 'memory_query_response' && message.data) {
        isQuerying.value = false

        const queryData = message.data
        if (queryData.success && queryData.data && queryData.data.entries) {
          // 后端返回的数据结构是 { entries: { thought: [], conversation: [], ... } }
          const entries = queryData.data.entries
          const newMemories: MemoryEntry[] = []

          // 遍历每种记忆类型
          for (const memoryType of ['thought', 'conversation', 'decision', 'experience']) {
            if (entries[memoryType] && Array.isArray(entries[memoryType])) {
              entries[memoryType].forEach((entry: any) => {
                newMemories.push({
                  ...entry,
                  memoryType: memoryType as 'thought' | 'conversation' | 'decision' | 'experience',
                })
              })
            }
          }

          // 合并查询结果
          newMemories.forEach((memory: MemoryEntry) => {
            const existingIndex = memories.value.findIndex((m) => m.id === memory.id)
            if (existingIndex === -1) {
              memories.value.push(memory)
            } else {
              memories.value[existingIndex] = memory
            }
          })

          ElMessage.success(`查询成功，共获取 ${newMemories.length} 条记忆`)
        } else if (!queryData.success) {
          ElMessage.error(queryData.message || '查询失败')
        }
      }

      // 处理添加响应
      if (message.type === 'memory_add_response' && message.data) {
        if (message.data.success) {
          ElMessage.success('记忆添加成功')
        } else {
          ElMessage.error(message.data.message || '记忆添加失败')
        }
      }

      // 处理删除响应
      if (message.type === 'memory_delete_response' && message.data) {
        if (message.data.success) {
          // 从列表中移除已删除的记忆
          const deletedId = message.data.data?.id
          if (deletedId) {
            memories.value = memories.value.filter((m) => m.id !== deletedId)
          }
          ElMessage.success('记忆删除成功')
        } else {
          ElMessage.error(message.data.message || '记忆删除失败')
        }
      }
    },
  )

  // 如果已经连接但没有订阅，自动订阅
  const subscription = maicraftNextStore.getComponentSubscriptions('memory-viewer')
  if (!subscription && maicraftNextStore.isConnected) {
    maicraftNextStore.subscribe('memory-viewer', ['memory'], 0)
  }

  // 组件卸载时清理
  onUnmounted(() => {
    removeMessageHandler()
  })
})
</script>

<style scoped>
/* 使用 MemoryViewer 组件的样式，这里不需要额外样式 */
</style>
