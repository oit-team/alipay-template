import { createI18n } from 'vue-i18n'
import cn from '@/locales/zh-CN.json'

export const i18n = createI18n({
  legacy: false,
  locale: 'zh-CN',
  messages: {
    'zh-CN': cn,
  },
})
