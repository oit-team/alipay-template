import type { Form } from '@formily/core'
import { i18n } from '@/plugins/i18n'
import ApiError from '@/api/ApiError'

interface Option<F extends object = any> {
  url: string
  form: Form<F>
  data: any
  transform?: (data: any) => any
}

/**
 * 初始化表单
 * @param option 初始选项
 */
export async function initForm(option: Option) {
  const { data } = await axios.post(option.url, option.data)
  option.form.setInitialValues(option.transform?.(data.body) ?? data.body)
}

/**
 * 未保存提示
 * @param modified 被修改过
 * @param done 确定事件
 */
export async function notSavedTips(modified: boolean, done: () => any) {
  const { t } = i18n.global
  modified && await ElMessageBox.confirm(
    t('confirm.notSaved'),
    t('tip.info'),
    { type: 'warning' },
  )
  done()
}

interface ValidateError {
  address: string
  code: string
  messages: string[]
  path: string
  triggerType: string
  type: string
}

export function handleSubmitFailed(
  err: ApiError | ValidateError[],
  option?: {
    mode?: 'count' | 'single' | 'all'
  },
) {
  if (err instanceof ApiError) {
    return Promise.reject(err)
  }
  else if (Array.isArray(err)) {
    switch (option?.mode) {
      case 'single':
        ElMessage.error(err[0].messages[0])
        break
      case 'all':
        err.forEach(e => ElMessage.error(e.messages[0]))
        break
      case 'count':
      default:
        ElMessage.error(`还有${err.length}项内容未填写`)
    }
  }
}
