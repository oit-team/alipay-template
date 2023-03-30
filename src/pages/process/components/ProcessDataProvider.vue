<script setup lang="ts">
import { pick } from 'lodash-es'
import { workOrderApplySymbol, workOrderInfoSymbol, workOrderSubmitSymbol } from '../types'
import type { WorkOrderApply, WorkOrderInfo, WorkOrderSubmit } from '../types'

enum OrderStatus {
  Abandon = -1,
  Processing = 0,
  Done = 1,
}

const route = useRoute()
const router = useRouter()
const viewStep = ref<number>()
const initParams = {
  flowCode: route.meta.flowCode,
  workCode: route.query.workCode || '',
}

if (!route.meta.flowCode) {
  ElMessage.warning('无效流程')
  router.back()
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
  if (options.approvalStatus === 0 && !options.approvalNotes) {
    const { value } = await ElMessageBox.prompt('填写拒绝原因', '提示')
    options.approvalNotes = value
  }

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
const currentStep = computed(() => flowStepsData.value?.workFlowSteps?.[viewStep.value!])

const workOrderInfo = computed<WorkOrderInfo>(() => ({
  ...flowStepsData.value,
  ...initParams,
  step: flowStepsData.value?.step,
  viewStep: viewStep.value,
  isReview: [OrderStatus.Done, OrderStatus.Abandon].includes(flowStepsData.value?.status)
            || viewStep.value! < flowStepsData.value?.step,
  setViewStep,
  currentLogs: currentLogs.value,
  currentStep: currentStep.value,
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
