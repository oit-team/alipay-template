import { registerValidateLocale, registerValidateRules, setValidateLanguage } from '@formily/core'
import type { UploadFile } from 'element-plus'

setValidateLanguage('zh-CN')

// 自定义校验提示
registerValidateLocale({
  'zh-CN': {
    required: '请填写必填项',
  },
})

// 自定义校验规则
registerValidateRules({
  upload: (fileList?: UploadFile[]) => {
    if (!fileList)
      return true

    const success = fileList.every(file => file.status === 'success')
    return success || '请等待文件上传完成'
  },
})
