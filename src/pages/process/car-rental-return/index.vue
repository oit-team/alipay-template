<route lang="yaml">
meta:
  title: 退车申请
  flowCode: CAR_RETURN
</route>

<script setup lang="ts">
import Logs from '../components/Logs.vue'
import { useFlowOption } from '../hooks/useFlowOption'
import Steps from '../components/Steps.vue'
import ApplyStep from './components/apply/index.vue'
import MaintainStep from './components/maintain/index.vue'
import MaintainConfirmStep from './components/maintain-confirm/index.vue'
import ValidateCarStep from './components/validate-car/index.vue'
import FinanceStep from './components/finance/index.vue'
import WarehousingStep from './components/warehousing/index.vue'
import VehicleServiceConfirmStep from './components/vehicle-service-confirm/index.vue'
import VexclusiveServiceSureStep from './components/exclusive-service-sure/index.vue'

const flowOption = useFlowOption()

const view = computed(() => ({
  CAR_RETURN_APPLICATION: ApplyStep,
  CAR_RETURN_INSPECTION: ValidateCarStep,
  CAR_RETURN_VEHICLE_MAINTENANCE: MaintainStep,
  CAR_RETURN_VEHICLE_MAINTENANCE_SURE: MaintainConfirmStep,
  CAR_RETURN_FINANCIAL_APPROVALS: FinanceStep,
  CAR_RETURN_SURE: WarehousingStep,
  CAR_RETURN_VEHICLE_SERVICE_SURE: VehicleServiceConfirmStep,
  CAR_RETURN_EXCLUSIVE_SERVICE_SURE: VexclusiveServiceSureStep,
}[flowOption?.stepCodeActive as string]))

const {
  data: workOrderReview,
  isLoading: isWorkOrderReviewLoading,
  execute: getReturnVehicleOrderMap,
} = useAxios('/order/returnVehicleOrder/getReturnVehicleOrderMap', {
  data: {
    workCode: flowOption?.workCode,
  },
}, { immediate: false })

if (flowOption?.workCode)
  getReturnVehicleOrderMap()

provide('workOrderReview', workOrderReview)
</script>

<template>
  <div u-flex="~ col" u-h-full>
    <Steps />

    <Component :is="view" v-if="!isWorkOrderReviewLoading" class="flex-1 formily-readonly car-rental-return" />

    <Logs />
  </div>
</template>

<style lang="scss" scoped>
.car-rental-return :deep(.el-card__body) {
  --el-card-padding: 12px;
}
</style>
