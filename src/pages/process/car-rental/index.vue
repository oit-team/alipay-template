<route lang="yaml">
meta:
  title: 租车申请
  flowCode: CAR_RENTAL
</route>

<script setup lang="ts">
import { workOrderInfoSymbol } from '../types'
import Logs from '../components/Logs.vue'
import Steps from '../components/Steps.vue'
import { useFlowOption } from '../hooks/useFlowOption'
import Step1 from './components/step-1/index.vue'
import Step2 from './components/step-2/index.vue'
import WarehousingStep from './components/warehousing/index.vue'

const workOrderInfo = inject(workOrderInfoSymbol)
const flowOption = useFlowOption()

const view = computed(() => ({
  CAR_RENTAL_APPLICATION: Step1,
  CAR_RENTAL_FINANCIAL_APPROVALS: Step2,
  CAR_RENTAL_SURE: WarehousingStep,
}[flowOption?.stepCodeActive as string]))

const {
  data: workOrderReview,
  isLoading: workOrderReviewLoading,
  execute: getReturnVehicleOrderMap,
} = useAxios('/order/leaseOrder/getLeaseOrderByNo', {
  data: {
    workCode: workOrderInfo?.value?.workCode,
  },
}, { immediate: false })

if (workOrderInfo?.value?.workCode)
  getReturnVehicleOrderMap()

provide('workOrderReview', workOrderReview)
</script>

<template>
  <div v-loading="workOrderReviewLoading" u-flex="~ col" u-h-full>
    <Steps />

    <Component :is="view" v-if="!workOrderReviewLoading" class="flex-1" :class="{ 'formily-readonly': workOrderInfo?.isReview }" />

    <Logs />
  </div>
</template>

<style lang="scss">
.el-step__title:not(.is-wait) {
  cursor: pointer;
}

.step--active {
  .el-step__title, .el-step__head {
    border-color: var(--el-color-warning);
    color: var(--el-color-warning);
  }
}
</style>
