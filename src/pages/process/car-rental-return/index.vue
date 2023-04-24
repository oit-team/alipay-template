<route lang="yaml">
meta:
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

const flowOption = useFlowOption()

const view = computed(() => ({
  CAR_RETURN_APPLICATION: ApplyStep,
  CAR_RETURN_INSPECTION: ValidateCarStep,
  CAR_RETURN_VEHICLE_MAINTENANCE: MaintainStep,
  CAR_RETURN_VEHICLE_MAINTENANCE_SURE: MaintainConfirmStep,
  CAR_RETURN_FINANCIAL_APPROVALS: FinanceStep,
  CAR_RETURN_SURE: WarehousingStep,
}[flowOption?.stepCodeActive as string]))

const {
  data: workOrderReview,
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

    <Component :is="view" class="flex-1 formily-readonly" />

    <Logs />
  </div>
</template>
