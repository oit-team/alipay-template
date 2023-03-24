import type { UploadFile, UploadUserFile } from 'element-plus'
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
  options?: {
    mode?: 'count' | 'single' | 'all'
  },
) {
  console.warn(err)
  if (err instanceof ApiError) {
    return Promise.reject(err)
  }
  else if (Array.isArray(err)) {
    switch (options?.mode ?? 'count') {
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
 * 转换上传数据
 * @param files 文件列表
 */
export function transformUploadData(files: UploadFile[], mode?: 'url'): {
  name: string
  url: string
}[] | undefined {
  const data = files?.map?.((file) => {
    const res = file.response as any
    return {
      name: file.name,
      url: res?.data?.fileUrl ?? file.url,
    }
  })
  return mode === 'url'
    ? data?.map?.(item => item.url)
    : data
}

export function transformToUploadFiles(urls: string[] | string): UploadUserFile[] | undefined {
  urls = typeof urls === 'string' ? JSON.parse(urls) : urls
  urls = Array.isArray(urls) ? urls : []
  return urls?.map?.((url, index) => ({
    name: `${index}`,
    url,
  }))
}
