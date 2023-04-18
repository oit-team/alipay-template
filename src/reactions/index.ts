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

export function useSelectAsyncDataSource(service: AsyncDataSourceSelectService, options?: { init: boolean }) {
  return (field: Field) => {
    const request = async (keyword: string) => {
      try {
        field.loading = true
        const data = await service({ field, keyword })
        field.dataSource = data
      }
      finally {
        field.loading = false
      }
    }

    field.setComponentProps({
      filterable: true,
      remote: true,
      remoteMethod: request,
    })

    // 初始化时请求一次
    options?.init && request('')
  }
}

/**
 * 获取城市列表
 */
export const getCityList: AsyncDataSourceSelectService = async ({ keyword }) => {
  const { data } = await axios.post('/order/scheme/getCitiesName', {
    keyWord: keyword,
  })
  return data.citiesName
}

/**
 * 获取车务
 */
export const vehicleServiceList: AsyncDataSourceSelectService = async ({ keyword }) => {
  const { data } = await axios.post('/system/user/getUserByKeyword', { keyWord: keyword })
  return data.result.map((item: any) => ({
    label: item.userName,
    value: item.userId,
  }))
}

/**
 * 获取品牌车系车型
 */
export const getVehicleBrandSeriesModel: AsyncDataSourceSelectService = async ({ keyword }) => {
  const { data } = await axios.post('/vehicle/vehicle/getVehicleBrandSeriesModel', { keyWord: keyword })
  return data.resultList.map((item: any) => ({
    label: item.brandSeriesModel,
    value: item.modelCode,
  }))
}

/**
 * 获取专属用户
 */
export const getUserKeyWord: AsyncDataSourceSelectService = async ({ keyword }) => {
  const { data } = await axios.post('/system/user/getUserByKeyword', {
    keyWord: keyword,
  })
  return data.result.map((e: { userName: string; userId: number }) => ({
    label: e.userName,
    value: e.userId,
  }))
}

/**
 * 获取司机类型
 */
export const getDriverTypeList: AsyncDataSourceSelectService = async () => {
  const { data } = await axios.post('/order/activity/getDictitemList', {
    dictCode: 'T3_DRIVER_TYPE',
  })
  return data.resultList.map((item: { nameKey: string }) => ({
    label: item.nameKey,
    value: item.nameKey,
  }))
}

/**
 * 获取公司列表
 */
export const getCompanyList: AsyncDataSourceSelectService = async () => {
  const { data } = await axios.post('/system/org/getTreeOrg')
  return data.result.map((item: { orgId: string; orgName: string }) => ({
    label: item.orgName,
    value: item.orgId,
  }))
}
