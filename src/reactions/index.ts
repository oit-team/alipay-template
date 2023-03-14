import type { Field, FieldDataSource } from '@formily/core'

export interface AsyncDataSourceService {
  (options: { field: Field }): Promise<FieldDataSource[]>
}

export interface AsyncDataSourceSelectService {
  (options: {
    field: Field
    keyword: string
  }): Promise<FieldDataSource[]>
}

/**
 * 获取城市列表
 */
export const getCityList: AsyncDataSourceSelectService = async ({ keyword }) => {
  if (!keyword)
    return []

  const { data } = await axios.post('/order/scheme/getCitiesName', {
    keyWord: keyword,
  })
  return data.body.citiesName
}
