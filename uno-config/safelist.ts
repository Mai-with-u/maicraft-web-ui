// Safelist配置 - 只包含真正需要保留的动态类名

export const safelist = [
  // === 动态生成的类（必须保留） ===
  // HeartbeatTest页面动态生成的统计值颜色类
  'stat-value-success',
  'stat-value-warning',
  'stat-value-error',

  // HeartbeatTest页面动态生成的日志级别类
  'log-level-info',
  'log-level-success',
  'log-level-warning',
  'log-level-error',

  // HeartbeatTest页面动态生成的日志项类
  'log-item-info',
  'log-item-success',
  'log-item-warning',
  'log-item-error',

  // === 动画类（防止摇树优化） ===
  'fade-in',
  'slide-up',

  // === 预设类（可能被检测不到） ===
  'level-trace',
  'level-debug',
  'level-info',
  'level-success',
  'level-warning',
  'level-error',
  'level-critical',

  // Sidebar组件类
  'sidebar',
  'sidebar-header',
  'logo-section',
  'logo-icon',
  'logo-section-h3',
  'sidebar-menu',
  'sidebar-nav',
  'sidebar-footer',
  'status-display',
  'status-dot',
  'status-text',
  'quick-action-btn',
  'version-display',

  // Sidebar动态条件类
  'bg-green-500',
]
