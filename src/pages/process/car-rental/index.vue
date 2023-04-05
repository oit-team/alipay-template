<route lang="yaml">
meta:
  flowCode: CAR_RENTAL
</route>

<script setup lang="ts">
import { workOrderInfoSymbol } from '../types'
import Logs from '../components/Logs.vue'
import Step1 from './components/step-1/index.vue'
import Step2 from './components/step-2/index.vue'
import WarehousingStep from './components/warehousing/index.vue'

const workOrderInfo = inject(workOrderInfoSymbol)

const view = computed(() => [
  Step1,
  Step2,
  WarehousingStep,
][workOrderInfo?.value?.viewStep ?? -1])

const {
  data: workOrderReview,
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
  <div u-flex="~ col" u-h-full>
    <ElSteps
      :active="workOrderInfo?.step"
      class="sticky top-0 z-10"
      finish-status="success"
      simple
    >
      <ElStep
        v-for="(item, index) of workOrderInfo?.workFlowSteps"
        :key="item.id"
        :class="{ 'step--active': workOrderInfo?.viewStep === index }"
        :title="item.name"
        @click="workOrderInfo?.setViewStep(index)"
      />
    </ElSteps>

    <Component :is="view" class="flex-1" :class="{ 'formily-readonly': workOrderInfo?.isReview }" />

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
