<script setup lang="ts">
import { pick } from 'lodash-es'
import { workOrderApplySymbol, workOrderInfoSymbol, workOrderSubmitSymbol } from '../types'
import type { WorkOrderApply, WorkOrderInfo, WorkOrderSubmit } from '../types'

const route = useRoute()
const viewStep = ref<number>()
const initParams = {
  flowCode: 'CAR_RETURN',
  workCode: route.query.workCode || '',
}

const {
  data: flowStepsData,
  isLoading,
} = useAxios('/workFlow/workFlow/getWorkFlowSteps', {
  data: {
    ...initParams,
  },
})

const workOrderApply: WorkOrderApply = (params) => {
  return axios.post('/workFlow/workFlow/workOrderApply', {
    ...pick(flowStepsData.value, ['workCode', 'flowCode']),
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

const currentLogs = computed(() => flowStepsData.value?.workFlowSteps?.[viewStep.value!]?.executeLogs)

const workOrderInfo = computed<WorkOrderInfo>(() => ({
  ...flowStepsData.value,
  ...initParams,
  step: flowStepsData.value?.step,
  viewStep: viewStep.value,
  isReview: viewStep.value! < flowStepsData.value?.step,
  setViewStep,
  currentLogs: currentLogs.value,
}))

function setViewStep(step: number) {
  if (step <= workOrderInfo.value.step)
    viewStep.value = step
}

watch(() => workOrderInfo.value.step, (step) => {
  viewStep.value = step
})

provide(workOrderInfoSymbol, workOrderInfo)
provide(workOrderApplySymbol, workOrderApply)
provide(workOrderSubmitSymbol, workOrderSubmit)
</script>

<template>
  <div v-loading="isLoading" u-h-full>
    <slot v-if="!isLoading" />
  </div>
</template>
