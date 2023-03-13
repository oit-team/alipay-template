import type { AxiosResponseTransformer } from 'axios'
import type { TableColumn } from '@uxuip/element-plus-query'

type Optional<T, K extends keyof T> = Omit<T, K> & Partial<Pick<T, K>>

export function mergeColumns<T extends TableColumn[]>(targetColumns: T, columns: Record<string, Optional<TableColumn, 'prop'>>) {
  return targetColumns?.map((item) => {
    if (item.prop && columns[item.prop]) {
      return {
        ...item,
        ...columns[item.prop],
      }
    }
    return item
  })
}

export function transformResponse(transformer: AxiosResponseTransformer | AxiosResponseTransformer[]): AxiosResponseTransformer[] {
  const transformerArray = Array.isArray(transformer) ? transformer : [transformer]
  const defaultTransformer = axios.defaults.transformResponse

  if (defaultTransformer)
    transformerArray.unshift(...Array.isArray(defaultTransformer) ? defaultTransformer : [defaultTransformer])

  return transformerArray
}
