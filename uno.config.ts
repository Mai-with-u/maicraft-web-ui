import { defineConfig } from 'unocss'
import { basePresets } from './uno-config/base'
import { pageRulesCombined } from './uno-config/pages'
import { safelist } from './uno-config/safelist'
import { baseShortcuts, baseTheme } from './uno-config/base'

export default defineConfig({
  // 启用预设
  presets: basePresets,

  // 自定义规则
  rules: pageRulesCombined,

  // 自定义快捷方式
  shortcuts: baseShortcuts,

  // 安全列表，确保这些类不会被清除
  safelist,

  // 主题配置
  theme: baseTheme,
})
