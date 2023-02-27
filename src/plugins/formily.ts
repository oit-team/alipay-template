import { registerValidateLocale, setValidateLanguage } from '@formily/core'

setValidateLanguage('zh-CN')

// 自定义校验提示
registerValidateLocale({
  'zh-CN': {
    required: '请填写此项',
  },
})
