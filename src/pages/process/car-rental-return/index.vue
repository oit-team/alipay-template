<script setup lang="ts">
import { workOrderInfoSymbol } from '../types'
import Logs from '../components/Logs.vue'
import ApplyStep from './components/apply/index.vue'
import MaintainStep from './components/maintain/index.vue'
import ValidateCarStep from './components/validate-car/index.vue'
import FinanceStep from './components/finance/index.vue'

const workOrderInfo = inject(workOrderInfoSymbol)

const view = computed(() => [
  ApplyStep,
  ValidateCarStep,
  MaintainStep,
  FinanceStep,
][workOrderInfo?.value?.viewStep ?? -1])

const {
  data: workOrderReview,
  execute: getReturnVehicleOrderMap,
} = useAxios('/order/returnVehicleOrder/getReturnVehicleOrderMap', {
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
        :class="{ 'step--active': workOrderInfo?.viewStep === index && workOrderInfo?.isReview }"
        :title="item.name"
        @click="workOrderInfo?.setViewStep(index)"
      />
    </ElSteps>

    <Component :is="view" class="flex-1" :class="{ 'formily-readonly': workOrderInfo?.isReview }" />

    <Logs />
  </div>
</template>

<style>
.el-step__title:not(.is-wait) {
  cursor: pointer;
}

.step--active .el-step__title {
  color: var(--el-color-primary);
}
</style>
