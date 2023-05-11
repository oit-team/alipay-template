<script setup lang="ts">
import { pick } from 'lodash-es'
import { flowOptionSymbol, workOrderApplySymbol, workOrderInfoSymbol, workOrderSubmitSymbol } from '../types'
import type { FlowOption, WorkOrderApply, WorkOrderInfo, WorkOrderSubmit } from '../types'

enum OrderStatus {
  Abandon = -1,
  Processing = 0,
  Done = 1,
}

const { t } = useI18n()
const route = useRoute()
const router = useRouter()
const stepActive = ref<number>()
const stepCodeActive = ref<string>()
const initParams = {
  flowCode: route.meta.flowCode as string,
  workCode: route.query.workCode as string ?? '',
}

if (!route.meta.flowCode) {
  ElMessage.warning('无效流程')
  router.back()
}

const {
  data: flowStepsData,
  isLoading,
} = useAxios('/workFlow/workFlow/getWorkFlowSteps', {
  data: initParams,
})

watch(flowStepsData, (data) => {
  stepActive.value = data?.step
  stepCodeActive.value = data?.taskCode || data?.workFlowSteps?.[0]?.taskCode
})

const workOrderApply: WorkOrderApply = (params) => {
  return axios.post('/workFlow/workFlow/workOrderApply', {
    ...pick(flowStepsData.value, ['workCode', 'flowCode']),
    params,
  })
}

const workOrderSubmit: WorkOrderSubmit = async (params, options = 1) => {
  options = typeof options === 'number' ? { approvalStatus: options } : options

  if (options.approvalStatus === 0 && !options.approvalNotes) {
    const { value } = await ElMessageBox.prompt('填写拒绝原因', '提示')
    options.approvalNotes = value
  }

  await ElMessageBox.confirm('确定要提交吗?', '提示', {
    type: 'info',
  })

  await axios.post('/workFlow/workFlow/submit', {
    ...initParams,
    ...options,
    params,
  })

  ElMessage.success(t('submit.success'))
  router.back()
}

async function reject(data = {}) {
  await workOrderSubmit?.(data, {
    approvalStatus: 0,
  })
}

const currentStep = computed(() => flowStepsData.value?.workFlowSteps?.[stepActive.value!])
const currentLogs = computed(() => currentStep.value?.executeLogs)
const isReview = computed(() =>
  [OrderStatus.Done, OrderStatus.Abandon].includes(flowStepsData.value?.status)
  || (flowStepsData.value?.taskCode && flowStepsData.value?.taskCode !== stepCodeActive.value)
  || !!Number(route.query.disabled),
)

const workOrderInfo = computed<WorkOrderInfo>(() => reactive({
  ...flowStepsData.value,
  ...initParams,
  step: flowStepsData.value?.step,
  viewStep: stepActive,
  viewStepCode: stepCodeActive,
  isReview,
  setViewStep,
  currentLogs,
  currentStep,
}))

function setViewStep(item: WorkOrderInfo['workFlowSteps'][number]) {
  if (item.clickEnable) {
    stepActive.value = item.step - 1
    stepCodeActive.value = item.taskCode
  }
}

watch(() => workOrderInfo.value.step, (step) => {
  stepActive.value = step
}, { immediate: true })

const flowOption = computed<FlowOption>(() => reactive({
  ...initParams,
  workFlowSteps: flowStepsData.value?.workFlowSteps,
  taskCode: flowStepsData.value?.taskCode,
  step: flowStepsData.value?.step,
  mainParams: flowStepsData.value?.mainParams,
  isReview,
  setViewStep,
  currentLogs,
  currentStep,
  stepActive,
  stepCodeActive,
  apply: workOrderApply,
  submit: workOrderSubmit,
  reject,
}))

provide(flowOptionSymbol, flowOption)
provide(workOrderInfoSymbol, workOrderInfo)
provide(workOrderApplySymbol, workOrderApply)
provide(workOrderSubmitSymbol, workOrderSubmit)
</script>

<template>
  <div v-loading="isLoading" u-h-full>
    <slot v-if="!isLoading" />
  </div>
</template>
