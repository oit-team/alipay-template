import type { UploadFile } from 'element-plus'
import type { Form } from '@formily/core'
import { i18n } from '@/plugins/i18n'
import ApiError from '@/api/ApiError'

interface InitFormOption {
  url: string
  form: Form<any>
  data: any
  transform?: (data: any) => any
}

/**
 * 初始化表单
 * @param option 初始选项
 */
export async function initForm(option: InitFormOption) {
  const { data } = await axios.post(option.url, option.data)
  option.form.setInitialValues(option.transform?.(data) ?? data)
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

/**
 * 处理表单提交错误
 */
export function handleSubmitFailed(
  err: ApiError | ValidateError[],
  option?: {
    mode?: 'single' | 'count' | 'all'
  },
) {
  console.warn(err)
  if (err instanceof ApiError) {
    return Promise.reject(err)
  }
  else if (Array.isArray(err)) {
    switch (option?.mode ?? 'single') {
      case 'single':
        ElMessage.error(err[0].messages[0])
        break
      case 'all':
        err.forEach(e => ElMessage.error(e.messages[0]))
        break
      case 'count':
        ElMessage.error(`还有${err.length}项未通过校验`)
    }
  }
}

/**
 * 格式化上传数据
 * @param files 文件列表
 */
export function formatUploadFile(files: UploadFile[]): {
  name: string
  url: string
}[] {
  return files.map((file) => {
    const res = file.response as any
    return {
      name: file.name,
      url: res?.data?.fileUrl ?? file.url,
    }
  })
}
