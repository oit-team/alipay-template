<script setup lang="ts">
import { pick } from 'lodash-es'
import ApplyStep from './components/apply/index.vue'
import MaintainStep from './components/maintain/index.vue'
import ValidateCarStep from './components/validate-car/index.vue'
import FinanceStep from './components/finance/index.vue'
import { workOrderApplySymbol, workOrderInfoSymbol, workOrderSubmitSymbol } from './types'
import type { WorkOrderApply, WorkOrderInfo, WorkOrderSubmit } from './types'

const route = useRoute()
const viewStep = ref(0)
const initParams = {
  flowCode: 'CAR_RETURN',
  workCode: route.query.workCode || '',
}

const view = computed(() => [
  ApplyStep,
  ValidateCarStep,
  MaintainStep,
  FinanceStep,
][viewStep.value])

const { data: workOrderReview, execute: getReturnVehicleOrderMap } = useAxios('/order/returnVehicleOrder/getReturnVehicleOrderMap', {
  data: {
    workCode: initParams.workCode,
  },
}, { immediate: false })

if (initParams.workCode)
  getReturnVehicleOrderMap()

provide('workOrderReview', workOrderReview)

const {
  data,
  isLoading,
} = useAxios('/workFlow/workFlow/getWorkFlowSteps', {
  data: {
    ...initParams,
  },
})

const workOrderApply: WorkOrderApply = (params) => {
  return axios.post('/workFlow/workFlow/workOrderApply', {
    ...pick(data.value, ['workCode', 'flowCode']),
    params,
  })
}

const workOrderSubmit: WorkOrderSubmit = async (params, options) => {
  await ElMessageBox.confirm('确定要提交吗?', '提示', {
    type: 'info',
  })

  return axios.post('/workFlow/workFlow/submit', {
    ...initParams,
    ...options,
    params,
  })
}

const workOrderInfo = computed<WorkOrderInfo>(() => ({
  ...data.value,
  step: data.value?.step,
  viewStep: viewStep.value,
  isReview: viewStep.value < data.value?.step,
}))

watch(() => workOrderInfo.value.step, (step) => {
  viewStep.value = step
})

provide(workOrderInfoSymbol, workOrderInfo)
provide(workOrderApplySymbol, workOrderApply)
provide(workOrderSubmitSymbol, workOrderSubmit)

function setViewStep(step: number) {
  if (step <= workOrderInfo.value.step)
    viewStep.value = step
}
</script>

<template>
  <div v-loading="isLoading" u-flex="~ col" u-h-full>
    <ElSteps
      :active="workOrderInfo?.step"
      class="sticky top-0 z-10"
      finish-status="success"
      simple
    >
      <ElStep
        v-for="(item, index) of data?.workFlowSteps"
        :key="item.id"
        :class="{ 'step--active': viewStep === index && viewStep < workOrderInfo.step }"
        :title="item.name"
        @click="setViewStep(index)"
      />
    </ElSteps>

    <ElScrollbar>
      <Component :is="view" v-if="!isLoading" :class="{ 'formily-readonly': workOrderInfo?.isReview }" />
    </ElScrollbar>
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
