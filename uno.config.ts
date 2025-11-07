import { defineConfig, presetUno, presetIcons } from 'unocss'

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
    // 自定义页面头部样式
    [
      'page-header',
      {
        display: 'flex',
        'justify-content': 'space-between',
        'align-items': 'center',
        'margin-bottom': '20px',
        padding: '16px 0',
        'border-bottom': '1px solid #e4e7ed',
      },
    ],

    // 页面头部标题
    [
      'page-title',
      {
        margin: '0',
        color: '#303133',
        'font-size': '20px',
        'font-weight': '600',
      },
    ],

    // 页面描述
    [
      'page-desc',
      {
        margin: '4px 0 0 0',
        color: '#606266',
        'font-size': '14px',
        'line-height': '1.4',
      },
    ],

    // 状态显示项
    [
      'status-item',
      {
        'text-align': 'center',
        padding: '20px',
        background: '#f8f9fa',
        'border-radius': '8px',
        border: '1px solid #e9ecef',
        transition: 'all 0.3s ease',
      },
    ],

    // 状态标签
    [
      'status-label',
      {
        'font-size': '14px',
        color: '#666',
        'margin-bottom': '8px',
        'font-weight': '500',
      },
    ],

    // 状态值
    [
      'status-value',
      {
        'font-size': '20px',
        'font-weight': 'bold',
        color: '#333',
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

    // PageHeader相关样式
    [
      'page-header-component',
      {
        display: 'flex',
        'justify-content': 'space-between',
        'align-items': 'center',
        'margin-bottom': '20px',
        background: 'white',
        padding: '16px 20px',
        'border-radius': '8px',
        'box-shadow': '0 2px 4px rgba(0, 0, 0, 0.1)',
      },
    ],
    [
      'page-header-title',
      {
        margin: '0',
        color: '#333',
        'font-size': '24px',
        'font-weight': '600',
      },
    ],
    [
      'header-left',
      {
        display: 'flex',
        'flex-direction': 'column',
      },
    ],
    [
      'header-actions',
      {
        display: 'flex',
        'align-items': 'center',
        gap: '12px',
      },
    ],
    [
      'connection-status',
      {
        'margin-right': '12px',
      },
    ],
    [
      'connection-buttons',
      {
        display: 'flex',
        gap: '12px',
        'margin-right': '12px',
      },
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

    // Home页面相关样式
    [
      'home-container',
      {
        padding: '20px',
        height: '100%',
        'overflow-y': 'auto',
        background: '#f5f5f5',
      },
    ],
    [
      'home-page-header',
      {
        'text-align': 'center',
        'margin-bottom': '40px',
        padding: '20px 0',
      },
    ],
    [
      'home-page-title',
      {
        'font-size': '32px',
        'font-weight': '700',
        color: '#333',
        'margin-bottom': '8px',
        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
        '-webkit-background-clip': 'text',
        '-webkit-text-fill-color': 'transparent',
        'background-clip': 'text',
      },
    ],
    [
      'home-page-description',
      {
        'font-size': '16px',
        color: '#666',
        margin: '0',
      },
    ],
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
        background: 'white',
        'border-radius': '12px',
        padding: '24px',
        'text-align': 'center',
        border: '1px solid #e6e6e6',
        cursor: 'pointer',
        transition: 'all 0.3s ease',
        'box-shadow': '0 2px 8px rgba(0, 0, 0, 0.1)',
      },
    ],
    [
      'page-card-hover',
      {
        transform: 'translateY(-4px)',
        'box-shadow': '0 8px 25px rgba(0, 0, 0, 0.15)',
        'border-color': '#409eff',
      },
    ],
    [
      'page-icon',
      {
        'font-size': '48px',
        color: '#409eff',
        'margin-bottom': '16px',
        display: 'block',
      },
    ],
    [
      'page-card-title',
      {
        'font-size': '18px',
        'font-weight': '600',
        'margin-bottom': '8px',
        color: '#333',
      },
    ],
    [
      'page-card-desc',
      {
        'font-size': '14px',
        color: '#666',
        'line-height': '1.5',
        margin: '0',
      },
    ],
    [
      'debug-card',
      {
        'border-color': '#e6a23c',
      },
    ],
    [
      'debug-card-hover',
      {
        'border-color': '#e6a23c',
        'box-shadow': '0 8px 25px rgba(230, 162, 60, 0.2)',
      },
    ],
    [
      'debug-icon',
      {
        color: '#e6a23c',
      },
    ],
    [
      'debug-section-title',
      {
        'grid-column': '1 / -1',
        'text-align': 'center',
        margin: '40px 0 20px 0',
        padding: '20px 0',
        'border-top': '2px solid #e6e6e6',
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
    [
      'projects-section',
      {
        'margin-top': '60px',
        padding: '30px 20px',
        background: '#fafafa',
        'border-radius': '12px',
        border: '1px solid #e6e6e6',
      },
    ],
    [
      'projects-header',
      {
        'text-align': 'center',
        'margin-bottom': '24px',
      },
    ],
    [
      'projects-title',
      {
        'font-size': '20px',
        'font-weight': '600',
        color: '#333',
        'margin-bottom': '4px',
      },
    ],
    [
      'projects-description',
      {
        'font-size': '14px',
        color: '#666',
        margin: '0',
      },
    ],
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
        display: 'flex',
        'align-items': 'center',
        gap: '8px',
        padding: '12px 16px',
        background: 'white',
        border: '1px solid #e6e6e6',
        'border-radius': '8px',
        'text-decoration': 'none',
        color: '#333',
        transition: 'all 0.3s ease',
        'font-size': '14px',
        'font-weight': '500',
      },
    ],
    [
      'project-link-item-hover',
      {
        'border-color': '#409eff',
        'box-shadow': '0 2px 8px rgba(64, 158, 255, 0.2)',
        color: '#409eff',
      },
    ],
    [
      'project-link-item-current',
      {
        'border-color': '#67c23a',
        background: '#f0f9ff',
        color: '#67c23a',
      },
    ],

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
    // 响应式网格类
    'grid-cols-2',
    'grid-cols-3',
    'grid-cols-4',
    'md:grid-cols-1',
    'lg:grid-cols-2',
    'lg:grid-cols-3',

    // 间距类
    'mb-0',
    'mb-1',
    'mb-2',
    'mb-3',
    'mb-4',
    'mt-0',
    'mt-1',
    'mt-2',
    'mt-3',
    'mt-4',
    'p-1',
    'p-2',
    'p-3',
    'p-4',

    // 文本对齐
    'text-center',
    'text-left',
    'text-right',

    // 字体粗细
    'font-bold',
    'font-medium',
    'font-normal',

    // Flex工具类
    'flex',
    'flex-col',
    'items-center',
    'justify-center',
    'justify-between',
    'gap-1',
    'gap-2',
    'gap-3',

    // 动画类
    'fade-in',
    'slide-up',

    // 日志级别颜色类
    'level-trace',
    'level-debug',
    'level-info',
    'level-success',
    'level-warning',
    'level-error',
    'level-critical',

    // 自定义组件类
    'page-header',
    'page-title',
    'page-desc',
    'status-item',
    'status-label',
    'status-value',

    // PageHeader组件类
    'page-header-component',
    'page-header-title',
    'header-left',
    'header-actions',
    'connection-status',
    'connection-buttons',

    // StatusDisplay组件类
    'status-display',
    'status-display-small',
    'status-display-large',
    'status-description',

    // Home页面类
    'home-container',
    'home-page-header',
    'home-page-title',
    'home-page-description',
    'page-grid',
    'page-card',
    'page-card-hover',
    'page-icon',
    'page-card-title',
    'page-card-desc',
    'debug-card',
    'debug-card-hover',
    'debug-icon',
    'debug-section-title',
    'debug-section-title-h2',
    'projects-section',
    'projects-header',
    'projects-title',
    'projects-description',
    'projects-links',
    'project-link-item',
    'project-link-item-hover',
    'project-link-item-current',
    'grid-2',
    'grid-3',
    'grid-auto-fit',
    'grid-auto-fill',
    'basic-grid',
    'basic-item',
    'item-label',
    'item-value',
    'control-panel',
    'control-card',
    'control-row',
    'control-item',
    'control-item-label',
    'mode-switch-container',
    'mode-label',
    'empty-state',
    'empty-icon',
    'empty-text',
    'empty-description',
    'loading-container',
    'tooltip-content',
    'stats-panel',
    'stats-section',
    'stats-section-h3',
    'stats-grid',
    'stat-item',
    'stat-label',
    'stat-value',

    // Sidebar相关类
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
