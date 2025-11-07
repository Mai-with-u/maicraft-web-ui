import { defineConfig, presetUno, presetIcons } from 'unocss'

// 颜色常量
const colors = {
  primary: '#409eff',
  success: '#67c23a',
  warning: '#e6a23c',
  danger: '#f56c6c',
  info: '#909399',
  gray: {
    100: '#f5f5f5',
    200: '#e6e6e6',
    300: '#d0d0d0',
    400: '#909399',
    500: '#666',
    600: '#606266',
    700: '#333',
    800: '#303133',
    900: '#1a1a1a',
  },
}

// 通用样式生成器
const createCardStyle = (bg = 'white', shadow = '0 2px 4px rgba(0, 0, 0, 0.1)') => ({
  background: bg,
  'border-radius': '8px',
  'box-shadow': shadow,
})

const createFlexStyle = (direction = 'row', justify = 'center', align = 'center', gap = '8px') => ({
  display: 'flex',
  'flex-direction': direction,
  'justify-content': justify,
  'align-items': align,
  gap,
})

// 生成颜色变体规则的辅助函数
const createColorVariants = (prefix: string, baseStyles: any, colors: Record<string, string>) => {
  return Object.entries(colors).map(([key, color]) => [
    `${prefix}-${key}`,
    { ...baseStyles, color },
  ])
}

export default defineConfig({
  // 启用预设
  presets: [
    presetUno(),
    presetIcons({
      collections: {
        ep: () => import('@iconify-json/ep/icons.json').then((i) => i.default),
        mdi: () => import('@iconify-json/mdi/icons.json').then((i) => i.default),
      },
    }),
  ],

  // 自定义规则
  rules: [
    // === 基础样式 ===
    [
      'page-header',
      {
        ...createFlexStyle('row', 'space-between', 'center'),
        'margin-bottom': '20px',
        padding: '16px 0',
        'border-bottom': `1px solid ${colors.gray[200]}`,
      },
    ],

    // 颜色变体
    ...createColorVariants('text', {}, colors),
    ...createColorVariants('text', {}, colors.gray),

    // 字体大小变体
    ...['xs', 'sm', 'base', 'lg', 'xl', '2xl', '3xl'].map((size) => [
      `text-${size}`,
      {
        'font-size':
          size === 'xs'
            ? '12px'
            : size === 'sm'
              ? '14px'
              : size === 'base'
                ? '16px'
                : size === 'lg'
                  ? '18px'
                  : size === 'xl'
                    ? '20px'
                    : size === '2xl'
                      ? '24px'
                      : '32px',
      },
    ]),

    // === 状态相关样式 ===
    [
      'status-item',
      {
        'text-align': 'center',
        padding: '20px',
        background: colors.gray[100],
        'border-radius': '8px',
        border: `1px solid ${colors.gray[200]}`,
        transition: 'all 0.3s ease',
      },
    ],
    [
      'status-label',
      {
        'font-size': '14px',
        color: colors.gray[500],
        'margin-bottom': '8px',
        'font-weight': '500',
      },
    ],
    [
      'status-value',
      {
        'font-size': '20px',
        'font-weight': 'bold',
        color: colors.gray[700],
      },
    ],

    // 网格布局
    ['grid-2', { display: 'grid', 'grid-template-columns': 'repeat(2, 1fr)', gap: '16px' }],
    ['grid-3', { display: 'grid', 'grid-template-columns': 'repeat(3, 1fr)', gap: '16px' }],
    [
      'grid-auto-fit',
      {
        display: 'grid',
        'grid-template-columns': 'repeat(auto-fit, minmax(200px, 1fr))',
        gap: '16px',
      },
    ],
    [
      'grid-auto-fill',
      {
        display: 'grid',
        'grid-template-columns': 'repeat(auto-fill, minmax(200px, 1fr))',
        gap: '16px',
      },
    ],

    // 基础网格
    [
      'basic-grid',
      {
        display: 'grid',
        'grid-template-columns': 'repeat(auto-fit, minmax(150px, 1fr))',
        gap: '16px',
      },
    ],
    ['basic-item', { display: 'flex', 'flex-direction': 'column', gap: '4px' }],
    [
      'item-label',
      {
        'font-size': '12px',
        color: '#909399',
        'font-weight': '500',
        'text-transform': 'uppercase',
        'letter-spacing': '0.5px',
      },
    ],
    ['item-value', { 'font-size': '16px', 'font-weight': '600', color: '#303133' }],

    // 控制面板样式
    ['control-panel', { 'margin-bottom': '20px' }],
    ['control-card', { border: '1px solid #e4e7ed' }],
    ['control-row', { display: 'flex', 'align-items': 'center', gap: '20px', 'flex-wrap': 'wrap' }],
    ['control-item', { display: 'flex', 'align-items': 'center', gap: '8px', 'min-width': '0' }],
    [
      'control-item-label',
      { 'font-size': '14px', color: '#606266', 'font-weight': '500', 'white-space': 'nowrap' },
    ],

    // 模式切换容器
    [
      'mode-switch-container',
      {
        display: 'flex',
        'align-items': 'center',
        gap: '12px',
        padding: '8px 16px',
        background: 'rgba(255, 255, 255, 0.9)',
        'border-radius': '8px',
        'box-shadow': '0 2px 8px rgba(0, 0, 0, 0.1)',
      },
    ],
    [
      'mode-label',
      { 'font-weight': '500', color: '#333', 'min-width': '60px', 'text-align': 'right' },
    ],

    // 空状态样式
    ['empty-state', { 'text-align': 'center', padding: '40px 20px', color: '#909399' }],
    ['empty-icon', { 'font-size': '48px', color: '#c0c4cc', 'margin-bottom': '16px' }],
    ['empty-text', { 'font-size': '16px', color: '#606266', 'margin-bottom': '8px' }],
    ['empty-description', { 'font-size': '14px', color: '#909399' }],

    // 加载状态
    [
      'loading-container',
      { display: 'flex', 'justify-content': 'center', 'align-items': 'center', padding: '40px' },
    ],

    // 工具提示样式
    ['tooltip-content', { 'max-width': '300px', 'line-height': '1.4' }],

    // 统计面板样式
    [
      'stats-panel',
      {
        background: 'white',
        'border-radius': '8px',
        padding: '16px 20px',
        'margin-bottom': '20px',
        'box-shadow': '0 2px 4px rgba(0, 0, 0, 0.1)',
      },
    ],
    ['stats-section', { 'margin-bottom': '20px' }],
    ['stats-section:last-child', { 'margin-bottom': '0' }],
    [
      'stats-section-h3',
      {
        margin: '0 0 12px 0',
        'font-size': '16px',
        color: '#333',
        'border-bottom': '2px solid #409eff',
        'padding-bottom': '4px',
      },
    ],
    [
      'stats-grid',
      {
        display: 'grid',
        'grid-template-columns': 'repeat(auto-fill, minmax(200px, 1fr))',
        gap: '12px',
      },
    ],
    [
      'stat-item',
      {
        display: 'flex',
        'align-items': 'center',
        gap: '8px',
        padding: '8px 12px',
        background: '#f8f9fa',
        'border-radius': '6px',
        border: '3px solid #409eff',
      },
    ],
    ['stat-label', { 'font-weight': '500', color: '#333', flex: '1' }],
    ['stat-value', { 'font-weight': 'bold', color: '#409eff', 'font-size': '14px' }],

    // 动画效果
    ['fade-in', { animation: 'fadeIn 0.3s ease-in' }],
    ['slide-up', { animation: 'slideUp 0.3s ease-out' }],

    // 文本工具类扩展
    ['text-sm', { 'font-size': '14px' }],
    ['text-xs', { 'font-size': '12px' }],

    // === PageHeader相关样式 ===
    [
      'page-header-component',
      {
        ...createCardStyle('white', '0 2px 4px rgba(0, 0, 0, 0.1)'),
        ...createFlexStyle('row', 'space-between', 'center'),
        'margin-bottom': '20px',
        padding: '16px 20px',
      },
    ],
    [
      'page-header-title',
      {
        margin: '0',
        color: colors.gray[700],
        'font-size': '24px',
        'font-weight': '600',
      },
    ],
    ['header-left', createFlexStyle('column')],
    ['header-actions', createFlexStyle('row', 'flex-start', 'center', '12px')],
    ['connection-status', { 'margin-right': '12px' }],
    [
      'connection-buttons',
      { ...createFlexStyle('row', 'flex-start', 'center', '12px'), 'margin-right': '12px' },
    ],

    // StatusDisplay相关样式
    [
      'status-display',
      {
        display: 'grid',
        gap: '16px',
        'grid-template-columns': 'repeat(auto-fit, minmax(150px, 1fr))',
      },
    ],
    [
      'status-display-small',
      {
        gap: '12px',
      },
    ],
    [
      'status-display-large',
      {
        gap: '24px',
      },
    ],
    [
      'status-description',
      {
        'font-size': '12px',
        color: '#909399',
        'margin-top': '4px',
        'line-height': '1.2',
      },
    ],

    // === Home页面相关样式 ===
    [
      'home-container',
      { padding: '20px', height: '100%', 'overflow-y': 'auto', background: colors.gray[100] },
    ],
    ['home-page-header', { 'text-align': 'center', 'margin-bottom': '40px', padding: '20px 0' }],
    [
      'home-page-title',
      {
        'font-size': '32px',
        'font-weight': '700',
        color: colors.gray[700],
        'margin-bottom': '8px',
        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
        '-webkit-background-clip': 'text',
        '-webkit-text-fill-color': 'transparent',
        'background-clip': 'text',
      },
    ],
    ['home-page-description', { 'font-size': '16px', color: colors.gray[500], margin: '0' }],

    // 页面卡片系统
    [
      'page-grid',
      {
        display: 'grid',
        'grid-template-columns': 'repeat(auto-fill, minmax(280px, 1fr))',
        gap: '24px',
        'max-width': '1200px',
        margin: '0 auto',
      },
    ],
    [
      'page-card',
      {
        ...createCardStyle('white', '0 2px 8px rgba(0, 0, 0, 0.1)'),
        padding: '24px',
        'text-align': 'center',
        border: `1px solid ${colors.gray[200]}`,
        cursor: 'pointer',
        transition: 'all 0.3s ease',
      },
    ],
    [
      'page-card-hover',
      {
        transform: 'translateY(-4px)',
        'box-shadow': '0 8px 25px rgba(0, 0, 0, 0.15)',
        'border-color': colors.primary,
      },
    ],
    [
      'page-icon',
      { 'font-size': '48px', color: colors.primary, 'margin-bottom': '16px', display: 'block' },
    ],
    [
      'page-card-title',
      {
        'font-size': '18px',
        'font-weight': '600',
        'margin-bottom': '8px',
        color: colors.gray[700],
      },
    ],
    [
      'page-card-desc',
      { 'font-size': '14px', color: colors.gray[500], 'line-height': '1.5', margin: '0' },
    ],

    // 调试卡片变体
    ['debug-card', { 'border-color': colors.warning }],
    [
      'debug-card-hover',
      { 'border-color': colors.warning, 'box-shadow': `0 8px 25px ${colors.warning}33` },
    ],
    ['debug-icon', { color: colors.warning }],

    // 调试区域标题
    [
      'debug-section-title',
      {
        'grid-column': '1 / -1',
        'text-align': 'center',
        margin: '40px 0 20px 0',
        padding: '20px 0',
        'border-top': `2px solid ${colors.gray[200]}`,
        background: 'linear-gradient(135deg, #fff3cd 0%, #ffeaa7 100%)',
        'border-radius': '8px',
      },
    ],
    [
      'debug-section-title-h2',
      {
        'font-size': '20px',
        'font-weight': '600',
        color: '#856404',
        margin: '0',
      },
    ],

    // 项目展示区域
    [
      'projects-section',
      {
        'margin-top': '60px',
        padding: '30px 20px',
        background: colors.gray[100],
        'border-radius': '12px',
        border: `1px solid ${colors.gray[200]}`,
      },
    ],
    ['projects-header', { 'text-align': 'center', 'margin-bottom': '24px' }],
    [
      'projects-title',
      {
        'font-size': '20px',
        'font-weight': '600',
        color: colors.gray[700],
        'margin-bottom': '4px',
      },
    ],
    ['projects-description', { 'font-size': '14px', color: colors.gray[500], margin: '0' }],
    [
      'projects-links',
      {
        display: 'grid',
        'grid-template-columns': 'repeat(auto-fit, minmax(200px, 1fr))',
        gap: '12px',
        'margin-bottom': '20px',
      },
    ],
    [
      'project-link-item',
      {
        ...createFlexStyle('row', 'flex-start', 'center', '8px'),
        padding: '12px 16px',
        background: 'white',
        border: `1px solid ${colors.gray[200]}`,
        'border-radius': '8px',
        'text-decoration': 'none',
        color: colors.gray[700],
        transition: 'all 0.3s ease',
        'font-size': '14px',
        'font-weight': '500',
      },
    ],
    [
      'project-link-item-hover',
      {
        'border-color': colors.primary,
        'box-shadow': `0 2px 8px ${colors.primary}33`,
        color: colors.primary,
      },
    ],
    [
      'project-link-item-current',
      {
        'border-color': colors.success,
        background: '#f0f9ff',
        color: colors.success,
      },
    ],

    // === Settings页面相关样式 ===
    ['settings-page', { padding: '20px', 'max-width': '1200px', margin: '0 auto' }],
    [
      'config-content',
      {
        ...createCardStyle('white', '0 2px 12px rgba(0, 0, 0, 0.08)'),
        'border-radius': '12px',
      },
    ],
    ['config-section', { padding: '20px' }],
    ['config-card', { 'margin-bottom': '20px' }],
    [
      'config-items',
      {
        display: 'grid',
        'grid-template-columns': 'repeat(auto-fit, minmax(300px, 1fr))',
        gap: '16px',
      },
    ],
    [
      'config-item',
      {
        ...createFlexStyle('row', 'flex-start', 'center', '12px'),
        padding: '12px 16px',
        background: colors.gray[100],
        'border-radius': '6px',
      },
    ],
    ['config-item-label', { 'font-weight': '500', color: colors.gray[500], 'min-width': '100px' }],
    ['config-item-value', { color: colors.gray[700], 'font-weight': '500' }],
    ['config-form', { padding: '20px 0' }],
    ['config-form-item', { 'margin-bottom': '20px' }],
    [
      'config-form-label',
      { 'font-weight': '500', color: colors.gray[700], 'margin-bottom': '8px' },
    ],
    ['import-form', { padding: '20px 0' }],

    // === HeartbeatTest页面相关样式 ===
    ['heartbeat-test-page', { padding: '20px', 'max-width': '1400px', margin: '0 auto' }],
    ['test-config', { 'margin-bottom': '24px' }],
    ['config-row', createFlexStyle('row', 'flex-start', 'center', '20px')],
    ['config-item', createFlexStyle('row', 'flex-start', 'center', '8px')],
    [
      'config-item-label',
      { 'font-weight': '500', color: colors.gray[500], 'white-space': 'nowrap' },
    ],
    ['test-results', { 'margin-bottom': '24px' }],
    ['stats-card', { height: '100%' }],
    ['stats-content', createFlexStyle('column', 'flex-start', 'flex-start', '12px')],

    // 统计项样式
    [
      'stat-item',
      {
        ...createFlexStyle('row', 'space-between', 'center'),
        padding: '8px 0',
        'border-bottom': `1px solid ${colors.gray[200]}`,
      },
    ],
    ['stat-item:last-child', { 'border-bottom': 'none' }],
    ['stat-label', { color: colors.gray[500], 'font-size': '14px' }],
    ['stat-value', { 'font-weight': '600', color: colors.gray[700] }],
    ...createColorVariants(
      'stat-value',
      { 'font-weight': '600' },
      { success: colors.success, warning: colors.warning, error: colors.danger },
    ),

    // 日志相关样式
    ['logs-card', { height: '400px' }],
    [
      'logs-container',
      {
        height: '320px',
        'overflow-y': 'auto',
        padding: '16px',
        background: colors.gray[100],
        'border-radius': '4px',
      },
    ],
    [
      'log-item',
      {
        'margin-bottom': '8px',
        padding: '8px 12px',
        'border-radius': '4px',
        'font-family': "'Monaco', 'Consolas', monospace",
        'font-size': '12px',
        'line-height': '1.4',
      },
    ],

    // 日志级别样式（使用颜色变体生成器）
    ...createColorVariants(
      'log-item',
      { background: '#f0f9ff', 'border-left': '3px solid' },
      {
        info: colors.primary,
        success: colors.success,
        warning: colors.warning,
        error: colors.danger,
      },
    ).map(([key, styles]) => [key.replace('text-', 'log-item-'), styles]),

    ['log-time', { color: colors.gray[400], 'margin-right': '8px' }],
    [
      'log-level',
      {
        display: 'inline-block',
        width: '60px',
        'text-align': 'center',
        'font-weight': '600',
        'font-size': '11px',
        'border-radius': '2px',
        'margin-right': '8px',
      },
    ],
    ...createColorVariants(
      'log-level',
      {},
      {
        info: colors.primary,
        success: colors.success,
        warning: colors.warning,
        error: colors.danger,
      },
    ).map(([key, styles]) => [
      key.replace('text-', 'log-level-'),
      {
        ...styles,
        background: `${styles.color}1A`, // 添加背景色
      },
    ]),
    ['log-message', { color: colors.gray[700] }],
    ['no-logs', { padding: '40px' }],

    // Sidebar相关样式
    [
      'sidebar',
      {
        height: '100vh',
        background: '#fff',
        'border-right': '1px solid #e6e6e6',
        display: 'flex',
        'flex-direction': 'column',
        transition: 'width 0.3s ease',
        'box-shadow': '2px 0 8px rgba(0, 0, 0, 0.1)',
      },
    ],
    [
      'sidebar-header',
      {
        height: '64px',
        display: 'flex',
        'align-items': 'center',
        'justify-content': 'space-between',
        padding: '0 20px',
        'border-bottom': '1px solid #e6e6e6',
        background: '#fafafa',
      },
    ],
    ['logo-section', { display: 'flex', 'align-items': 'center', gap: '12px' }],
    ['logo-icon', { 'font-size': '28px', color: '#409eff' }],
    ['logo-section-h3', { margin: '0', 'font-size': '18px', 'font-weight': '600', color: '#333' }],
    ['sidebar-menu', { flex: '1', 'overflow-y': 'auto', padding: '12px 0' }],
    ['sidebar-nav', { 'border-right': 'none', background: 'transparent' }],
    [
      'sidebar-footer',
      { padding: '20px', 'border-top': '1px solid #e6e6e6', background: '#fafafa' },
    ],
    [
      'status-display',
      {
        display: 'flex',
        'align-items': 'center',
        gap: '8px',
        padding: '6px 12px',
        background: '#f8f9fa',
        'border-radius': '6px',
        border: '1px solid #e9ecef',
      },
    ],
    [
      'status-dot',
      {
        width: '8px',
        height: '8px',
        'border-radius': '50%',
        background: '#ff4d4f',
        transition: 'background-color 0.3s ease',
        'flex-shrink': '0',
      },
    ],
    ['status-text', { 'font-size': '12px', color: '#666', 'font-weight': '500' }],
    [
      'quick-action-btn',
      {
        width: '100%',
        padding: '8px 12px',
        'border-radius': '6px',
        transition: 'all 0.3s ease',
        'font-size': '12px',
        'font-weight': '500',
      },
    ],
    [
      'version-display',
      {
        'text-align': 'center',
        cursor: 'pointer',
        transition: 'all 0.3s ease',
        'border-radius': '6px',
        padding: '4px 8px',
      },
    ],
  ],

  // 自定义快捷方式
  shortcuts: {
    // 布局快捷方式
    'flex-center': 'flex items-center justify-center',
    'flex-between': 'flex items-center justify-between',
    'flex-col-center': 'flex flex-col items-center justify-center',

    // 按钮快捷方式
    'btn-primary': 'px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition-colors',
    'btn-secondary': 'px-4 py-2 bg-gray-500 text-white rounded hover:bg-gray-600 transition-colors',

    // 卡片快捷方式
    card: 'bg-white rounded-lg shadow-md p-4 border border-gray-200',

    // 文本快捷方式
    'text-primary': 'text-gray-900',
    'text-secondary': 'text-gray-600',
    'text-muted': 'text-gray-400',
  },

  // 安全列表，确保这些类不会被清除
  safelist: [
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

    // === 预设类（可能被摇树优化） ===
    // 动画类
    'fade-in',
    'slide-up',

    // 一些可能检测不到的预设类
    'level-trace',
    'level-debug',
    'level-info',
    'level-success',
    'level-warning',
    'level-error',
    'level-critical',
  ],

  // 主题配置
  theme: {
    colors: {
      primary: '#409eff',
      success: '#67c23a',
      warning: '#e6a23c',
      danger: '#f56c6c',
      info: '#909399',

      // Element Plus 兼容颜色
      'el-primary': '#409eff',
      'el-success': '#67c23a',
      'el-warning': '#e6a23c',
      'el-danger': '#f56c6c',
      'el-info': '#909399',
    },
    animation: {
      keyframes: {
        fadeIn:
          '{ from { opacity: 0; transform: translateY(10px); } to { opacity: 1; transform: translateY(0); } }',
        slideUp:
          '{ from { opacity: 0; transform: translateY(20px); } to { opacity: 1; transform: translateY(0); } }',
      },
      durations: {
        'fade-in': '0.3s',
        'slide-up': '0.3s',
      },
      timingFns: {
        'fade-in': 'ease-in',
        'slide-up': 'ease-out',
      },
    },
  },
})
