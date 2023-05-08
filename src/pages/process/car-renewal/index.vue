<route lang="yaml">
meta:
  title: 车辆续租
  flowCode: CAR_RENEWAL
</route>

<script setup lang="ts">
import { useFlowOption } from '../hooks/useFlowOption'
import Steps from '../components/Steps.vue'
import Logs from '../components/Logs.vue'
import ApplyStep from './components/apply/index.vue'
import ConfirmStep from './components/confirm/index.vue'

const flowOption = useFlowOption()!

const view = computed(() => ({
  CAR_RENEWAL_APPLY: ApplyStep,
  CAR_RENEWAL_VEHICLE_SERVICE_SURE: ConfirmStep,
}[flowOption?.stepCodeActive as string]))

const {
  data: workOrderReview,
  isLoading: workOrderReviewLoading,
  execute: getReturnVehicleOrderMap,
} = useAxios('/order/leaseOrder/getLeaseOrderByNo', {
  data: {
    workCode: flowOption?.workCode,
  },
}, { immediate: false })

if (flowOption?.workCode)
  getReturnVehicleOrderMap()

provide('workOrderReview', workOrderReview)
</script>

<template>
  <div v-loading="workOrderReviewLoading" u-flex="~ col" u-h-full>
    <Steps />

    <Component :is="view" v-if="!workOrderReviewLoading" class="flex-1" :class="{ 'formily-readonly': flowOption?.isReview }" />

    <Logs />
  </div>
</template>
