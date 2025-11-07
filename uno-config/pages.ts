import { colors, createCardStyle, createFlexStyle } from './base'

// 页面布局规则（简化重复的页面容器样式）
export const pageRules = [
  // 通用页面容器
  ['page-container', { padding: '20px', 'max-width': '1400px', margin: '0 auto' }],

  // 页面头部样式（合并相似的头部样式）
  [
    'page-header',
    {
      ...createFlexStyle('row', 'space-between', 'center'),
      'margin-bottom': '20px',
      padding: '16px 0',
      'border-bottom': `1px solid ${colors.gray[200]}`,
    },
  ],
  [
    'page-title',
    { margin: '0', color: colors.gray[800], 'font-size': '24px', 'font-weight': '600' },
  ],
  [
    'page-desc',
    { margin: '4px 0 0 0', color: colors.gray[600], 'font-size': '14px', 'line-height': '1.4' },
  ],

  // === Home页面 ===
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
  ['debug-card', { 'border-color': colors.warning }],
  [
    'debug-card-hover',
    { 'border-color': colors.warning, 'box-shadow': `0 8px 25px ${colors.warning}33` },
  ],
  ['debug-icon', { color: colors.warning }],
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

  // === Settings页面 ===
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
  ['config-form-label', { 'font-weight': '500', color: colors.gray[700], 'margin-bottom': '8px' }],
  ['import-form', { padding: '20px 0' }],

  // === HeartbeatTest页面 ===
  ['heartbeat-test-page', { padding: '20px', 'max-width': '1400px', margin: '0 auto' }],
  ['test-config', { 'margin-bottom': '24px' }],
  ['config-row', createFlexStyle('row', 'flex-start', 'center', '20px')],
  ['config-item-label', { 'font-weight': '500', color: colors.gray[500], 'white-space': 'nowrap' }],
  ['test-results', { 'margin-bottom': '24px' }],
  ['stats-card', { height: '100%' }],
  ['stats-content', createFlexStyle('column', 'flex-start', 'flex-start', '12px')],
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
  ['log-message', { color: colors.gray[700] }],
  ['no-logs', { padding: '40px' }],

  // === AgentManager页面 ===
  ['agent-manager-page', { padding: '20px', 'max-width': '1200px', margin: '0 auto' }],
  [
    'agent-content',
    {
      ...createCardStyle('white', '0 2px 12px rgba(0, 0, 0, 0.08)'),
      padding: '20px',
    },
  ],
  ['status-card', { 'margin-bottom': '20px' }],
  ['config-card', { 'margin-bottom': '20px' }],
  ['info-card', { 'margin-bottom': '20px' }],
  ['agent-status', { padding: '20px 0' }],
  [
    'status-item',
    {
      ...createFlexStyle('row', 'flex-start', 'center', '12px'),
      padding: '8px 0',
    },
  ],
  ['status-item-label', { 'font-weight': '500', color: colors.gray[500], 'min-width': '80px' }],
  ['status-item-value', { color: colors.gray[700], 'font-weight': '500' }],
  ['config-form', { padding: '20px 0' }],
  ['form-tip', { 'font-size': '12px', color: colors.gray[400], 'margin-top': '4px' }],
  ['env-info', { padding: '20px 0' }],
  ['env-list', { 'margin-top': '10px' }],
  [
    'env-item',
    {
      ...createFlexStyle('row', 'flex-start', 'center', '10px'),
      'margin-bottom': '8px',
      padding: '8px 12px',
      background: colors.gray[100],
      'border-radius': '6px',
    },
  ],
  ['header-description', { color: colors.gray[500], 'font-size': '14px' }],

  // === Sidebar相关样式 ===
  [
    'sidebar',
    {
      height: '100vh',
      background: '#fff',
      'border-right': `1px solid ${colors.gray[200]}`,
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
      'border-bottom': `1px solid ${colors.gray[200]}`,
      background: colors.gray[100],
    },
  ],
  ['logo-section', { display: 'flex', 'align-items': 'center', gap: '12px' }],
  ['logo-icon', { 'font-size': '28px', color: colors.primary }],
  [
    'logo-section-h3',
    { margin: '0', 'font-size': '18px', 'font-weight': '600', color: colors.gray[700] },
  ],
  ['sidebar-menu', { flex: '1', 'overflow-y': 'auto', padding: '12px 0' }],
  ['sidebar-nav', { 'border-right': 'none', background: 'transparent' }],
  [
    'sidebar-footer',
    {
      padding: '20px',
      'border-top': `1px solid ${colors.gray[200]}`,
      background: colors.gray[100],
    },
  ],
  [
    'status-display',
    {
      display: 'flex',
      'align-items': 'center',
      gap: '8px',
      padding: '6px 12px',
      background: colors.gray[100],
      'border-radius': '6px',
      border: `1px solid ${colors.gray[200]}`,
    },
  ],
  [
    'status-dot',
    {
      width: '8px',
      height: '8px',
      'border-radius': '50%',
      background: colors.danger,
      transition: 'background-color 0.3s ease',
      'flex-shrink': '0',
    },
  ],
  ['status-text', { 'font-size': '12px', color: colors.gray[500], 'font-weight': '500' }],
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

  // === TokenUsage页面 ===
  ['token-usage-page', { padding: '20px', 'max-width': '1400px', margin: '0 auto' }],
  [
    'control-item-label',
    { 'font-weight': '500', color: colors.gray[500], 'white-space': 'nowrap' },
  ],
  ['summary-section', { 'margin-bottom': '24px' }],
  ['stat-card', { height: '100px' }],
  [
    'stat-content',
    {
      ...createFlexStyle('row', 'flex-start', 'center', '16px'),
    },
  ],
  ['stat-icon', { 'font-size': '32px', color: colors.primary }],
  ['stat-info', { flex: '1' }],
  [
    'stat-value',
    {
      'font-size': '24px',
      'font-weight': '600',
      color: colors.gray[700],
      'margin-bottom': '4px',
    },
  ],
  ['stat-label', { 'font-size': '14px', color: colors.gray[500] }],
  ['models-section', { 'margin-bottom': '24px' }],
  [
    'models-list',
    {
      'max-height': '600px',
      'overflow-y': 'auto',
    },
  ],
  ['model-item', { 'margin-bottom': '8px' }],
  [
    'model-header',
    {
      ...createFlexStyle('row', 'space-between', 'center'),
      width: '100%',
    },
  ],
  ['model-name', { 'font-weight': '600', color: colors.gray[700] }],
  ['model-stats', createFlexStyle('row', 'flex-start', 'center', '8px')],
  ['model-details', { padding: '16px 0' }],
  ['detail-section', { 'margin-bottom': '20px' }],

  // === PageHeader组件样式 ===
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

  // === StatusDisplay组件样式 ===
  [
    'status-display',
    {
      display: 'grid',
      gap: '16px',
      'grid-template-columns': 'repeat(auto-fit, minmax(150px, 1fr))',
    },
  ],
  ['status-display-small', { gap: '12px' }],
  ['status-display-large', { gap: '24px' }],
  [
    'status-description',
    {
      'font-size': '12px',
      color: colors.gray[400],
      'margin-top': '4px',
      'line-height': '1.2',
    },
  ],

  // === 通用状态项目样式 ===
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

  // === 网格布局工具 ===
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
  [
    'basic-grid',
    {
      display: 'grid',
      'grid-template-columns': 'repeat(auto-fit, minmax(150px, 1fr))',
      gap: '16px',
    },
  ],

  // === 基础项目样式 ===
  ['basic-item', createFlexStyle('column', 'flex-start', 'flex-start', '4px')],
  [
    'item-label',
    {
      'font-size': '12px',
      color: colors.gray[400],
      'font-weight': '500',
      'text-transform': 'uppercase',
      'letter-spacing': '0.5px',
    },
  ],
  ['item-value', { 'font-size': '16px', 'font-weight': '600', color: colors.gray[800] }],

  // === 控制面板样式 ===
  ['control-panel', { 'margin-bottom': '20px' }],
  ['control-card', { border: `1px solid ${colors.gray[200]}` }],
  ['control-row', createFlexStyle('row', 'flex-start', 'center', '20px')],
  ['control-item', createFlexStyle('row', 'flex-start', 'center', '8px')],
  [
    'control-item-label',
    { 'font-size': '14px', color: colors.gray[600], 'font-weight': '500', 'white-space': 'nowrap' },
  ],

  // === 动画效果 ===
  ['fade-in', { animation: 'fadeIn 0.3s ease-in' }],
  ['slide-up', { animation: 'slideUp 0.3s ease-out' }],

  // === 文本工具类扩展 ===
  ['text-sm', { 'font-size': '14px' }],
  ['text-xs', { 'font-size': '12px' }],
]

// 生成日志相关的颜色变体
export const logRules = [
  // 日志级别样式（使用颜色变体生成器）
  ...[
    [
      'log-item',
      { background: '#f0f9ff', 'border-left': '3px solid' },
      {
        info: colors.primary,
        success: colors.success,
        warning: colors.warning,
        error: colors.danger,
      },
    ],
    [
      'log-level',
      {},
      {
        info: colors.primary,
        success: colors.success,
        warning: colors.warning,
        error: colors.danger,
      },
    ],
  ]
    .map(([prefix, baseStyles, colorMap]) =>
      Object.entries(colorMap).map(([key, color]) => [
        `${prefix}-${key}`,
        { ...baseStyles, color },
      ]),
    )
    .flat(),

  // 特殊处理log-level的背景色
  ...Object.entries({
    info: colors.primary,
    success: colors.success,
    warning: colors.warning,
    error: colors.danger,
  }).map(([key, color]) => [`log-level-${key}`, { background: `${color}1A` }]),
]

// 统计值颜色变体
export const statValueRules = [
  [`stat-value-success`, { 'font-weight': '600', color: colors.success }],
  [`stat-value-warning`, { 'font-weight': '600', color: colors.warning }],
  [`stat-value-error`, { 'font-weight': '600', color: colors.danger }],
]

// 合并所有页面规则
export const pageRulesCombined = [...pageRules, ...logRules, ...statValueRules]
