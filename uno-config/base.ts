import { presetUno, presetIcons } from 'unocss'

// 颜色常量
export const colors = {
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
export const createCardStyle = (bg = 'white', shadow = '0 2px 4px rgba(0, 0, 0, 0.1)') => ({
  background: bg,
  'border-radius': '8px',
  'box-shadow': shadow,
})

export const createFlexStyle = (
  direction = 'row',
  justify = 'center',
  align = 'center',
  gap = '8px',
) => ({
  display: 'flex',
  'flex-direction': direction,
  'justify-content': justify,
  'align-items': align,
  gap,
})

// 生成颜色变体规则的辅助函数
export const createColorVariants = (
  prefix: string,
  baseStyles: any,
  colors: Record<string, string>,
) => {
  return Object.entries(colors).map(([key, color]) => [
    `${prefix}-${key}`,
    { ...baseStyles, color },
  ])
}

// 基础预设配置
export const basePresets = [
  presetUno(),
  presetIcons({
    collections: {
      ep: () => import('@iconify-json/ep/icons.json').then((i) => i.default),
      mdi: () => import('@iconify-json/mdi/icons.json').then((i) => i.default),
    },
  }),
]

// 基础主题配置
export const baseTheme = {
  colors: {
    primary: colors.primary,
    success: colors.success,
    warning: colors.warning,
    danger: colors.danger,
    info: colors.info,
    'el-primary': colors.primary,
    'el-success': colors.success,
    'el-warning': colors.warning,
    'el-danger': colors.danger,
    'el-info': colors.info,
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
}

// 基础快捷方式
export const baseShortcuts = {
  'flex-center': 'flex items-center justify-center',
  'flex-between': 'flex items-center justify-between',
  'flex-col-center': 'flex flex-col items-center justify-center',
  card: 'bg-white rounded-lg shadow-md p-4 border border-gray-200',
  'text-primary': 'text-gray-900',
  'text-secondary': 'text-gray-600',
  'text-muted': 'text-gray-400',
}
