import type { AxiosResponseTransformer } from 'axios'
import type { TableColumn } from '@uxuip/element-plus-query'
import { defaultTransformResponse, transformResponse } from '~/api'

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

export function transformResponsePush(transformer: AxiosResponseTransformer | AxiosResponseTransformer[]): AxiosResponseTransformer[] {
  const transformerArray = Array.isArray(transformer) ? transformer : [transformer]
  return [
    defaultTransformResponse,
    transformResponse,
    ...transformerArray,
  ]
}

/**
 * 脱敏
 * @param value 值
 * @param options 配置
 */
export function numberMasking(
  value: number | string | undefined,
  options: { start?: number; end?: number; symbol?: string } = {},
) {
  if (value === undefined || value === '')
    return value
  const str = String(value)
  const { start = 3, end = 7, symbol = '*' } = options
  const _end = end < 0 ? str.length + end : end
  const len = _end - start
  return str.replace(str.substring(start, _end), len > 0 ? symbol.repeat(len) : '')
}
