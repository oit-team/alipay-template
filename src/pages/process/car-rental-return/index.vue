<route lang="yaml">
meta:
  flowCode: CAR_RETURN
</route>

<script setup lang="ts">
import { workOrderInfoSymbol } from '../types'
import Logs from '../components/Logs.vue'
import ApplyStep from './components/apply/index.vue'
import MaintainStep from './components/maintain/index.vue'
import ValidateCarStep from './components/validate-car/index.vue'
import FinanceStep from './components/finance/index.vue'
import WarehousingStep from './components/warehousing/index.vue'

const workOrderInfo = inject(workOrderInfoSymbol)

const view = computed(() => [
  ApplyStep,
  ValidateCarStep,
  MaintainStep,
  MaintainStep,
  FinanceStep,
  WarehousingStep,
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
        :class="{ 'step--active': workOrderInfo?.viewStep === index }"
        :title="item.name"
        @click="workOrderInfo?.setViewStep(index)"
      />
    </ElSteps>

    <Component :is="view" class="flex-1 formily-readonly" />

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
