import type { LocationQueryRaw } from 'vue-router'
import router from '@/router'

export const flowRouteMap: Record<string, string> = {
  CAR_RENTAL: '/process/car-rental',
  CAR_RETURN: '/process/car-rental-return',
  CAR_EXTENSION: '/process/extension-request',
}

export function toFlowPage(flowCode: string, query?: LocationQueryRaw) {
  const path = flowRouteMap[flowCode]
  if (!path)
    return ElMessage.warning('未找到对应的流程页面')
  router.push({ path, query })
}
