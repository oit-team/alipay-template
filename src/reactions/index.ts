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

export function useAsyncDataSource(service: AsyncDataSourceService) {
  return async (field: Field) => {
    try {
      field.loading = true
      const data = await service({ field })
      field.dataSource = data
    }
    finally {
      field.loading = false
    }
  }
}

export function useSelectAsyncDataSource(service: AsyncDataSourceSelectService) {
  return (field: Field) => {
    field.setComponentProps({
      remoteMethod: async (keyword: string) => {
        try {
          field.loading = true
          const data = await service({ field, keyword })
          field.dataSource = data
        }
        finally {
          field.loading = false
        }
      },
    })
  }
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
  return data.citiesName
}

/**
 * 获取专属用户
 */
export const getUserKeyWord: AsyncDataSourceSelectService = async ({ keyword }) => {
  if (!keyword)
    return []

  const { data } = await axios.post('/system/user/getUserByKeyword', {
    keyWord: keyword,
  })
  return data.result.map((e: { userName: string; userId: number }) => ({
    label: e.userName,
    value: e.userId,
  }))
}

