<template>
  <div class="memory-viewer">
    <!-- 页面标题 -->
    <div class="header">
      <h1 class="title">
        <el-icon class="title-icon"><Memo /></el-icon>
        Maicraft-Next 记忆查看器
      </h1>
    </div>

    <!-- 连接和订阅状态 -->
    <el-row :gutter="20" class="status-row">
      <el-col :span="6">
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
              size="small"
            >
              {{ isConnected ? '断开连接' : '连接服务器' }}
            </el-button>
          </div>
        </el-card>
      </el-col>

      <el-col :span="6">
        <el-card class="status-card">
          <template #header>
            <div class="card-header">
              <el-icon><DataLine /></el-icon>
              <span>订阅状态</span>
            </div>
          </template>
          <div class="status-content">
            <div class="subscription-info">
              <p class="info-label">已订阅:</p>
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
                  未订阅
                </el-tag>
              </div>
            </div>
          </div>
        </el-card>
      </el-col>

      <el-col :span="6">
        <el-card class="status-card">
          <template #header>
            <div class="card-header">
              <el-icon><Document /></el-icon>
              <span>记忆统计</span>
            </div>
          </template>
          <div class="status-content">
            <div class="stats-info">
              <div class="stat-item">
                <span class="stat-label">总数:</span>
                <span class="stat-value">{{ totalMemories }}</span>
              </div>
              <div class="stat-item">
                <span class="stat-label">推送:</span>
                <span class="stat-value">{{ pushCount }}</span>
              </div>
            </div>
          </div>
        </el-card>
      </el-col>

      <el-col :span="6">
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
            </div>
          </div>
        </el-card>
      </el-col>
    </el-row>

    <!-- 订阅和查询控制 -->
    <el-card class="control-card">
      <template #header>
        <div class="card-header">
          <el-icon><Operation /></el-icon>
          <span>订阅和查询控制</span>
        </div>
      </template>
      <div class="control-content">
        <!-- 订阅控制 -->
        <div class="control-section">
          <h4>订阅设置</h4>
          <div class="control-row">
            <div class="filter-group">
              <label>记忆类型:</label>
              <el-checkbox-group v-model="subscriptionFilters.memoryTypes" size="small">
                <el-checkbox label="thought">思维</el-checkbox>
                <el-checkbox label="conversation">对话</el-checkbox>
                <el-checkbox label="decision">决策</el-checkbox>
                <el-checkbox label="experience">经验</el-checkbox>
              </el-checkbox-group>
            </div>
            <div class="filter-group">
              <label>重要性:</label>
              <el-select v-model="subscriptionFilters.importance" placeholder="选择重要性" size="small" clearable style="width: 120px">
                <el-option label="高" value="high" />
                <el-option label="正常" value="normal" />
                <el-option label="低" value="low" />
              </el-select>
            </div>
          </div>
          <div class="control-buttons">
            <el-button type="primary" @click="subscribeMemory" :disabled="!isConnected" size="small">
              <el-icon class="mr-1"><Plus /></el-icon>
              订阅记忆
            </el-button>
            <el-button type="warning" @click="unsubscribeMemory" :disabled="!isConnected" size="small">
              <el-icon class="mr-1"><Minus /></el-icon>
              取消订阅
            </el-button>
          </div>
        </div>

        <!-- 查询控制 -->
        <div class="control-section">
          <h4>查询设置</h4>
          <div class="control-row">
            <div class="filter-group">
              <label>查询类型:</label>
              <el-checkbox-group v-model="queryFilters.memoryTypes" size="small">
                <el-checkbox label="thought">思维</el-checkbox>
                <el-checkbox label="conversation">对话</el-checkbox>
                <el-checkbox label="decision">决策</el-checkbox>
                <el-checkbox label="experience">经验</el-checkbox>
              </el-checkbox-group>
            </div>
            <div class="filter-group">
              <label>重要性:</label>
              <el-select v-model="queryFilters.importance" placeholder="选择重要性" size="small" clearable style="width: 120px">
                <el-option label="高" value="high" />
                <el-option label="正常" value="normal" />
                <el-option label="低" value="low" />
              </el-select>
            </div>
            <div class="filter-group">
              <label>限制数量:</label>
              <el-input-number v-model="queryFilters.limit" :min="1" :max="1000" size="small" style="width: 100px" />
            </div>
          </div>
          <div class="control-buttons">
            <el-button type="success" @click="queryMemory" :disabled="!isConnected" size="small">
              <el-icon class="mr-1"><Search /></el-icon>
              查询记忆
            </el-button>
            <el-button type="info" @click="clearMemories" size="small">
              <el-icon class="mr-1"><Delete /></el-icon>
              清空列表
            </el-button>
          </div>
        </div>
      </div>
    </el-card>

    <!-- 记忆列表 -->
    <DataTable
      :data="memories"
      :loading="isLoading"
      title="记忆列表"
      description="显示所有记忆条目，支持实时推送和手动查询"
      :searchable="true"
      search-placeholder="搜索记忆内容..."
      :search-fields="['content', 'message', 'lesson', 'intention', 'speaker']"
      empty-text="暂无记忆数据"
      :show-pagination="true"
      :max-height="'calc(100vh - 500px)'"
    >
      <!-- 表格列 -->
      <el-table-column type="selection" width="55" />
      <el-table-column prop="memoryType" label="类型" width="100" sortable>
        <template #default="scope">
          <el-tag :type="getMemoryTypeTag(scope.row.memoryType)">
            {{ getMemoryTypeLabel(scope.row.memoryType) }}
          </el-tag>
        </template>
      </el-table-column>
      <el-table-column prop="importance" label="重要性" width="80" sortable>
        <template #default="scope">
          <el-tag :type="getImportanceTag(scope.row.importance)" size="small">
            {{ getImportanceLabel(scope.row.importance) }}
          </el-tag>
        </template>
      </el-table-column>
      <el-table-column prop="timestamp" label="时间" width="160" sortable>
        <template #default="scope">
          {{ formatTimestamp(scope.row.timestamp) }}
        </template>
      </el-table-column>
      <el-table-column prop="content" label="内容" min-width="200" show-overflow-tooltip>
        <template #default="scope">
          <div class="memory-content">
            {{ getMemoryContent(scope.row) }}
          </div>
        </template>
      </el-table-column>
      <el-table-column prop="context" label="上下文" min-width="150" show-overflow-tooltip>
        <template #default="scope">
          <div class="memory-context">
            {{ getMemoryContext(scope.row) }}
          </div>
        </template>
      </el-table-column>
      <el-table-column label="操作" width="120" fixed="right">
        <template #default="scope">
          <el-button size="small" type="primary" @click="viewMemoryDetail(scope.row)" plain>
            查看
          </el-button>
          <el-button size="small" type="danger" @click="deleteMemory(scope.row)" plain>
            删除
          </el-button>
        </template>
      </el-table-column>

      <!-- 表格操作栏 -->
      <template #actions>
        <el-button type="primary" @click="addMemory" :disabled="!isConnected">
          <el-icon class="mr-1"><Plus /></el-icon>
          添加记忆
        </el-button>
        <el-button type="warning" @click="batchDeleteMemories" :disabled="selectedMemories.length === 0">
          <el-icon class="mr-1"><Delete /></el-icon>
          批量删除
        </el-button>
      </template>
    </DataTable>

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
        <el-form-item
          :label="getContentLabel(addForm.memoryType)"
          prop="content"
        >
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
        <el-button type="primary" @click="submitAddMemory" :loading="addLoading">
          添加
        </el-button>
      </template>
    </el-dialog>

    <!-- 记忆详情对话框 -->
    <el-dialog v-model="detailDialogVisible" title="记忆详情" width="700px">
      <div v-if="currentMemory" class="memory-detail">
        <el-descriptions :column="2" border>
          <el-descriptions-item label="ID">{{ currentMemory.id }}</el-descriptions-item>
          <el-descriptions-item label="类型">{{ getMemoryTypeLabel(currentMemory.memoryType) }}</el-descriptions-item>
          <el-descriptions-item label="重要性">{{ getImportanceLabel(currentMemory.importance) }}</el-descriptions-item>
          <el-descriptions-item label="时间">{{ formatTimestamp(currentMemory.timestamp) }}</el-descriptions-item>
          <el-descriptions-item :span="2" label="内容">
            <pre class="memory-full-content">{{ getMemoryContent(currentMemory) }}</pre>
          </el-descriptions-item>
          <el-descriptions-item :span="2" label="上下文">
            <pre class="memory-full-context">{{ JSON.stringify(currentMemory.context || {}, null, 2) }}</pre>
          </el-descriptions-item>
          <el-descriptions-item v-if="currentMemory.confidence" label="置信度">
            {{ currentMemory.confidence }}
          </el-descriptions-item>
          <el-descriptions-item v-if="currentMemory.occurrences" label="出现次数">
            {{ currentMemory.occurrences }}
          </el-descriptions-item>
        </el-descriptions>
      </div>
      <template #footer>
        <el-button @click="detailDialogVisible = false">关闭</el-button>
        <el-button type="primary" @click="editMemory(currentMemory)" v-if="currentMemory">
          编辑
        </el-button>
      </template>
    </el-dialog>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, onUnmounted, reactive } from 'vue'
import { useMaicraftNextStore } from '../stores/maicraftNext'
import DataTable from '../components/common/DataTable.vue'
import {
  Memo,
  Connection,
  DataLine,
  Document,
  Clock,
  Operation,
  Plus,
  Minus,
  Search,
  Delete,
} from '@element-plus/icons-vue'
import { ElMessage, ElMessageBox } from 'element-plus'

// 定义组件名称
defineOptions({
  name: 'MaicraftNextMemoryViewer',
})

// 使用全局store
const maicraftNextStore = useMaicraftNextStore()

// 记忆条目接口
interface MemoryEntry {
  id: string
  timestamp: number
  memoryType: 'thought' | 'conversation' | 'decision' | 'experience'
  importance?: 'high' | 'normal' | 'low'
  [key: string]: any
}

// 从store获取连接状态
const isConnected = computed(() => maicraftNextStore.isConnected)
const isConnecting = computed(() => maicraftNextStore.isConnecting)
const subscribedTypes = computed(() => maicraftNextStore.subscribedTypes)

// 响应式数据
const memories = ref<MemoryEntry[]>([])
const selectedMemories = ref<MemoryEntry[]>([])
const isLoading = ref(false)
const pushCount = ref(0)
const lastUpdate = ref(0)

// 订阅过滤器
const subscriptionFilters = reactive({
  memoryTypes: ['thought', 'conversation', 'decision', 'experience'],
  importance: undefined as string | undefined,
})

// 查询过滤器
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

// 记忆详情
const detailDialogVisible = ref(false)
const currentMemory = ref<MemoryEntry | null>(null)

// 计算属性
const totalMemories = computed(() => memories.value.length)

const lastUpdateText = computed(() => {
  if (!lastUpdate.value) return '从未'
  const now = Date.now()
  const diff = now - lastUpdate.value
  if (diff < 1000) return '刚刚'
  if (diff < 60000) return `${Math.floor(diff / 1000)}秒前`
  if (diff < 3600000) return `${Math.floor(diff / 60000)}分钟前`
  return `${Math.floor(diff / 3600000)}小时前`
})

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

const getMemoryTypeTag = (type: string) => {
  const tags: Record<string, string> = {
    thought: 'primary',
    conversation: 'success',
    decision: 'warning',
    experience: 'info',
  }
  return tags[type] || 'info'
}

const getImportanceLabel = (importance?: string) => {
  const labels: Record<string, string> = {
    high: '高',
    normal: '正常',
    low: '低',
  }
  return labels[importance || 'normal'] || '正常'
}

const getImportanceTag = (importance?: string) => {
  const tags: Record<string, string> = {
    high: 'danger',
    normal: 'warning',
    low: 'info',
  }
  return tags[importance || 'normal'] || 'warning'
}

const formatTimestamp = (timestamp: number) => {
  return new Date(timestamp).toLocaleString('zh-CN')
}

const getMemoryContent = (memory: MemoryEntry) => {
  switch (memory.memoryType) {
    case 'thought':
      return memory.content || ''
    case 'conversation':
      return memory.message || ''
    case 'decision':
      return memory.intention || memory.result || ''
    case 'experience':
      return memory.lesson || ''
    default:
      return ''
  }
}

const getMemoryContext = (memory: MemoryEntry) => {
  if (!memory.context) return '-'
  if (typeof memory.context === 'string') return memory.context
  return Object.keys(memory.context).join(', ')
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

// 连接管理
const toggleConnection = async () => {
  if (maicraftNextStore.isConnected) {
    maicraftNextStore.disconnect()
    ElMessage.info('已断开连接')
  } else {
    try {
      await maicraftNextStore.connect()
      ElMessage.success('连接成功')
    } catch (error) {
      console.error('连接失败:', error)
      ElMessage.error('连接失败')
    }
  }
}

// 订阅记忆
const subscribeMemory = () => {
  const filters: any = {}
  if (subscriptionFilters.memoryTypes.length > 0) {
    filters.memoryTypes = subscriptionFilters.memoryTypes
  }
  if (subscriptionFilters.importance) {
    filters.importance = subscriptionFilters.importance
  }

  const success = maicraftNextStore.subscribe('memory-viewer', ['memory'], 0, filters)
  if (success) {
    ElMessage.success('已发送订阅请求')
  } else {
    ElMessage.error('发送订阅请求失败')
  }
}

// 取消订阅
const unsubscribeMemory = () => {
  maicraftNextStore.unsubscribe('memory-viewer')
  ElMessage.success('已取消记忆订阅')
}

// 查询记忆
const queryMemory = () => {
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
    isLoading.value = true
    ElMessage.success('已发送查询请求')
  } else {
    ElMessage.error('发送查询请求失败')
  }
}

// 清空记忆列表
const clearMemories = () => {
  memories.value = []
  pushCount.value = 0
  ElMessage.success('已清空记忆列表')
}

// 添加记忆
const addMemory = () => {
  addForm.memoryType = 'thought'
  addForm.importance = 'normal'
  addForm.content = ''
  addForm.context = ''
  addDialogVisible.value = true
}

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
      } catch (error) {
        ElMessage.error('添加失败')
      } finally {
        addLoading.value = false
      }
    }
  })
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

// 查看记忆详情
const viewMemoryDetail = (memory: MemoryEntry) => {
  currentMemory.value = memory
  detailDialogVisible.value = true
}

// 编辑记忆（暂时只显示详情）
const editMemory = (memory: MemoryEntry) => {
  // TODO: 实现编辑功能
  ElMessage.info('编辑功能待实现')
}

// 删除记忆
const deleteMemory = async (memory: MemoryEntry) => {
  try {
    await ElMessageBox.confirm(
      `确定要删除这条${getMemoryTypeLabel(memory.memoryType)}记忆吗？`,
      '确认删除',
      {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning',
      }
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

// 批量删除记忆
const batchDeleteMemories = async () => {
  if (selectedMemories.value.length === 0) return

  try {
    await ElMessageBox.confirm(
      `确定要删除选中的 ${selectedMemories.value.length} 条记忆吗？`,
      '确认批量删除',
      {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning',
      }
    )

    let successCount = 0
    const manager = getMaicraftNextWebSocketManager()

    for (const memory of selectedMemories.value) {
      const deleteMessage = {
        type: 'memory_delete',
        data: {
          memoryType: memory.memoryType,
          id: memory.id,
        },
      }

      if (manager.sendMessage(deleteMessage)) {
        successCount++
      }
    }

    ElMessage.success(`已发送 ${successCount} 个删除请求`)
    selectedMemories.value = []
  } catch {
    // 用户取消删除
  }
}

// 组件挂载
onMounted(() => {
  // 添加消息处理器
  const removeMessageHandler = maicraftNextStore.addMessageHandler('memory-viewer', (message: any) => {
    // 处理记忆推送
    if (message.type === 'memory_push' && message.data) {
      const memoryData = message.data
      if (memoryData.memoryType && memoryData.entry) {
        memories.value.unshift({
          ...memoryData.entry,
          memoryType: memoryData.memoryType,
        })

        // 限制记忆数量，避免内存溢出
        if (memories.value.length > 1000) {
          memories.value = memories.value.slice(0, 1000)
        }

        pushCount.value++
      }
    }

    // 处理查询响应
    if (message.type === 'memory_query_response' && message.data) {
      const queryData = message.data
      if (Array.isArray(queryData.memories)) {
        // 合并查询结果
        queryData.memories.forEach((memory: any) => {
          const existingIndex = memories.value.findIndex(m => m.id === memory.id)
          if (existingIndex === -1) {
            memories.value.push(memory)
          } else {
            memories.value[existingIndex] = memory
          }
        })
      }
      isLoading.value = false
    }

    // 处理添加响应
    if (message.type === 'memory_add_response' && message.data) {
      ElMessage.success('记忆添加成功')
    }

    // 处理删除响应
    if (message.type === 'memory_delete_response' && message.data) {
      // 从列表中移除已删除的记忆
      const deletedId = message.data.id
      memories.value = memories.value.filter(m => m.id !== deletedId)
      ElMessage.success('记忆删除成功')
    }

    lastUpdate.value = Date.now()
  })

  // 如果已经连接但没有订阅，自动订阅
  const subscription = maicraftNextStore.getComponentSubscriptions('memory-viewer')
  if (!subscription && maicraftNextStore.isConnected) {
    maicraftNextStore.subscribe('memory-viewer', ['memory'], 0, {
      memoryTypes: subscriptionFilters.memoryTypes,
      importance: subscriptionFilters.importance,
    })
  }

  // 组件卸载时清理
  onUnmounted(() => {
    removeMessageHandler()
  })
})
</script>

<style scoped>
.memory-viewer {
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

.subscription-info,
.stats-info {
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

.stat-item {
  display: flex;
  justify-content: space-between;
  margin-bottom: 5px;
}

.stat-label {
  font-weight: 500;
  color: #606266;
}

.stat-value {
  font-weight: 600;
  color: #409eff;
}

.update-info {
  text-align: center;
}

.update-time {
  margin: 0;
  font-size: 16px;
  font-weight: 600;
  color: #409eff;
}

.control-card {
  margin-bottom: 20px;
}

.control-content {
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.control-section {
  border-bottom: 1px solid #e4e7ed;
  padding-bottom: 15px;
}

.control-section:last-child {
  border-bottom: none;
  padding-bottom: 0;
}

.control-section h4 {
  margin: 0 0 10px 0;
  color: #303133;
  font-size: 16px;
  font-weight: 600;
}

.control-row {
  display: flex;
  gap: 20px;
  margin-bottom: 10px;
  flex-wrap: wrap;
}

.filter-group {
  display: flex;
  flex-direction: column;
  gap: 5px;
}

.filter-group label {
  font-weight: 500;
  color: #606266;
  font-size: 14px;
}

.control-buttons {
  display: flex;
  gap: 10px;
}

.memory-content,
.memory-context {
  max-width: 300px;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.memory-detail {
  max-height: 500px;
  overflow-y: auto;
}

.memory-full-content,
.memory-full-context {
  margin: 0;
  white-space: pre-wrap;
  word-break: break-word;
  font-family: 'Courier New', monospace;
  font-size: 12px;
  background: #f5f7fa;
  padding: 10px;
  border-radius: 4px;
  border: 1px solid #e4e7ed;
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

@keyframes pulse {
  0%,
  100% {
    opacity: 1;
  }
  50% {
    opacity: 0.5;
  }
}

@media (max-width: 768px) {
  .control-row {
    flex-direction: column;
    gap: 10px;
  }

  .control-buttons {
    flex-direction: column;
  }

  .status-row .el-col {
    margin-bottom: 10px;
  }
}
</style>
