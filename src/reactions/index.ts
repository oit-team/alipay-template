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

export const getCityList: AsyncDataSourceSelectService = async ({ keyword }) => {
  await axios.post('/sysdat/cities/getCityList', {
    city: keyword,
  })
  return []
}
