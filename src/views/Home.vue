<template>
  <div class="home-container">
    <!-- 页面标题 -->
    <div class="home-page-header">
      <h1 class="home-page-title">Maicraft Web UI</h1>
      <p class="home-page-description">选择功能模块开始使用</p>
    </div>

    <!-- 页面卡片网格 -->
    <div class="page-grid">
      <!-- 主页 -->
      <div class="page-card hover:page-card-hover" @click="navigateTo('/')">
        <el-icon class="page-icon"><House /></el-icon>
        <h3 class="page-card-title">主页</h3>
        <p class="page-card-desc">欢迎页面，展示系统概览</p>
      </div>

      <!-- Agent 日志 -->
      <div class="page-card hover:page-card-hover" @click="navigateTo('/logs')">
        <el-icon class="page-icon"><Document /></el-icon>
        <h3 class="page-card-title">Agent 日志</h3>
        <p class="page-card-desc">查看和管理Maicraft Agent的运行日志</p>
      </div>

      <!-- MCP Server 日志 -->
      <div class="page-card hover:page-card-hover" @click="navigateTo('/mcp-logs')">
        <el-icon class="page-icon"><Document /></el-icon>
        <h3 class="page-card-title">MCP Server 日志</h3>
        <p class="page-card-desc">监控MCP服务器的详细日志信息</p>
      </div>

      <!-- 游戏状态 -->
      <div
        class="page-card hover:page-card-hover"
        @click="navigateTo('/game-monitoring/world-player-dashboard')"
      >
        <el-icon class="page-icon"><Monitor /></el-icon>
        <h3 class="page-card-title">游戏状态</h3>
        <p class="page-card-desc">实时监控游戏世界和玩家状态</p>
      </div>

      <!-- MCP 工具 -->
      <div class="page-card hover:page-card-hover" @click="navigateTo('/mcp-tools')">
        <el-icon class="page-icon"><Tools /></el-icon>
        <h3 class="page-card-title">MCP 工具</h3>
        <p class="page-card-desc">管理和调用MCP协议的各种工具</p>
      </div>

      <!-- Token 监控 -->
      <div class="page-card hover:page-card-hover" @click="navigateTo('/token-usage')">
        <el-icon class="page-icon"><Histogram /></el-icon>
        <h3 class="page-card-title">Token 监控</h3>
        <p class="page-card-desc">监控AI模型的Token使用量和成本</p>
      </div>

      <!-- 任务管理 -->
      <div class="page-card hover:page-card-hover" @click="navigateTo('/task-manager')">
        <el-icon class="page-icon"><List /></el-icon>
        <h3 class="page-card-title">任务管理</h3>
        <p class="page-card-desc">管理和监控后台任务的执行状态</p>
      </div>

      <!-- 设置 -->
      <div class="page-card hover:page-card-hover" @click="navigateTo('/settings')">
        <el-icon class="page-icon"><Setting /></el-icon>
        <h3 class="page-card-title">设置</h3>
        <p class="page-card-desc">系统配置和个性化设置</p>
      </div>

      <!-- 调试工具分组标题 -->
      <div class="debug-section-title">
        <h2 class="debug-section-title-h2">调试工具</h2>
      </div>

      <!-- WebSocket 监控 -->
      <div
        class="page-card debug-card hover:debug-card-hover"
        @click="navigateTo('/websocket-monitor')"
      >
        <el-icon class="page-icon debug-icon"><Monitor /></el-icon>
        <h3 class="page-card-title">WebSocket 监控</h3>
        <p class="page-card-desc">实时监控WebSocket连接状态</p>
      </div>

      <!-- WebSocket 调试 -->
      <div
        class="page-card debug-card hover:debug-card-hover"
        @click="navigateTo('/websocket-debugger')"
      >
        <el-icon class="page-icon debug-icon"><Monitor /></el-icon>
        <h3 class="page-card-title">WebSocket 调试</h3>
        <p class="page-card-desc">调试WebSocket消息和连接</p>
      </div>

      <!-- WebSocket 模拟器 -->
      <div
        class="page-card debug-card hover:debug-card-hover"
        @click="navigateTo('/websocket-simulator')"
      >
        <el-icon class="page-icon debug-icon"><Monitor /></el-icon>
        <h3 class="page-card-title">WebSocket 模拟器</h3>
        <p class="page-card-desc">模拟WebSocket数据用于测试</p>
      </div>

      <!-- 心跳测试 -->
      <div
        class="page-card debug-card hover:debug-card-hover"
        @click="navigateTo('/heartbeat-test')"
      >
        <el-icon class="page-icon debug-icon"><Monitor /></el-icon>
        <h3 class="page-card-title">心跳测试</h3>
        <p class="page-card-desc">测试WebSocket心跳连接稳定性</p>
      </div>
    </div>

    <!-- 项目介绍区域 -->
    <div class="projects-section">
      <div class="projects-header">
        <h2 class="projects-title">项目生态</h2>
        <p class="projects-description">了解Maicraft系列项目的整体架构</p>
      </div>

      <div class="projects-links">
        <el-tooltip content="专注于 群组聊天 的赛博网友（比较专注）多平台智能体" placement="top">
          <a
            href="https://github.com/MaiM-with-u/MaiBot"
            target="_blank"
            class="project-link-item hover:project-link-item-hover"
          >
            <el-icon><ChatDotRound /></el-icon>
            <span>MaiBot (智能聊天)</span>
          </a>
        </el-tooltip>

        <el-tooltip
          content="Amadeus的Typo形态，MaiBot的Vtuber项目，处理弹幕、tts、stt等直播任务"
          placement="top"
        >
          <a
            href="https://github.com/MaiM-with-u/Amaidesu"
            target="_blank"
            class="project-link-item hover:project-link-item-hover"
          >
            <el-icon><Star /></el-icon>
            <span>Amaidesu (Vtuber)</span>
          </a>
        </el-tooltip>

        <el-tooltip
          content="基于大语言模型的智能Minecraft代理系统核心项目，结合LLM、Mineflayer和Agent技术，实现自主游戏任务执行"
          placement="top"
        >
          <a
            href="https://github.com/MaiM-with-u/Maicraft"
            target="_blank"
            class="project-link-item hover:project-link-item-hover"
          >
            <el-icon><Grid /></el-icon>
            <span>Maicraft (游戏代理)</span>
          </a>
        </el-tooltip>

        <el-tooltip
          content="MCP（Minecraft Control Protocol）服务器实现，为Web界面和外部工具提供Minecraft游戏控制接口"
          placement="top"
        >
          <a
            href="https://github.com/ChangingSelf/maicraft-mcp-server"
            target="_blank"
            class="project-link-item hover:project-link-item-hover"
          >
            <el-icon><Tools /></el-icon>
            <span>MCP Server (游戏控制)</span>
          </a>
        </el-tooltip>

        <el-tooltip
          content="Vue.js开发的现代化Web界面，提供直观的Minecraft代理系统管理和监控功能，支持实时日志、任务管理和WebSocket调试"
          placement="top"
        >
          <a
            href="https://github.com/ChangingSelf/maicraft-web-ui"
            target="_blank"
            class="project-link-item project-link-item-current"
          >
            <el-icon><Monitor /></el-icon>
            <span>Web UI (调试工具)</span>
          </a>
        </el-tooltip>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useRouter } from 'vue-router'
import { PageHeader } from '@/components/common'
import {
  Monitor,
  Document,
  Setting,
  House,
  Tools,
  Histogram,
  List,
  Grid,
  Link,
  ChatDotRound,
  Star,
} from '@element-plus/icons-vue'

const router = useRouter()

// 页面跳转函数
const navigateTo = (path: string) => {
  router.push(path)
}
</script>

<style scoped>
/* 只保留响应式设计 */
@media (max-width: 768px) {
  .home-container {
    padding: 15px;
  }

  .home-page-header {
    margin-bottom: 30px;
  }

  .home-page-title {
    font-size: 24px;
  }

  .home-page-description {
    font-size: 14px;
  }

  /* 项目介绍区域响应式 */
  .projects-section {
    margin-top: 40px;
    padding: 20px 15px;
  }

  .projects-title {
    font-size: 18px;
  }

  .projects-description {
    font-size: 13px;
  }

  .projects-links {
    grid-template-columns: 1fr;
    gap: 10px;
  }

  .project-link-item {
    padding: 10px 12px;
    font-size: 13px;
  }

  .project-link-item .el-icon {
    font-size: 14px;
  }

  .page-grid {
    grid-template-columns: 1fr;
    gap: 16px;
  }

  .page-card {
    padding: 20px;
  }

  .page-icon {
    font-size: 40px;
  }

  .page-card-title {
    font-size: 16px;
  }

  .page-card-desc {
    font-size: 13px;
  }

  .debug-section-title {
    margin: 30px 0 15px 0;
  }

  .debug-section-title-h2 {
    font-size: 18px;
  }
}

@media (max-width: 480px) {
  .page-card {
    padding: 16px;
  }

  .page-icon {
    font-size: 36px;
    margin-bottom: 12px;
  }

  .page-card-title {
    font-size: 15px;
  }

  .page-card-desc {
    font-size: 12px;
  }
}
</style>
