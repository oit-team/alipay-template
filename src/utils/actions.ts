import type { Form } from '@formily/core'

interface Option<F extends object = any> {
  url: string
  form: Form<F>
  data: any
  transform?: (data: any) => any
}

export async function initForm(option: Option) {
  const { data } = await axios.post(option.url, option.data)
  option.form.setInitialValues(option.transform?.(data.body) ?? data.body)
}
