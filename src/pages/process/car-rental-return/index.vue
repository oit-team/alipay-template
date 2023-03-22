<script setup lang="ts">
import { pick } from 'lodash-es'
import Step1 from './components/step-1/index.vue'
import Step2 from './components/step-2/index.vue'
import Step3 from './components/step-3/index.vue'
import { workOrderApplySymbol, workOrderInfoSymbol, workOrderSubmitSymbol } from './types'
import type { WorkOrderApply, WorkOrderSubmit } from './types'

const route = useRoute()
const viewStep = ref(0)
const initParams = {
  flowCode: 'CAR_RETURN',
  workCode: route.query.workCode || '',
  taskCode: route.query.taskCode || '',
}

const view = computed(() => [Step1, Step2, Step3, Step2][viewStep.value])

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
    ...pick(data.value, ['workCode', 'flowCode', 'taskCode']),
    params,
  })
}

const workOrderSubmit: WorkOrderSubmit = (params, options) => {
  return axios.post('/workFlow/workFlow/submit', {
    ...initParams,
    ...options,
    params,
  })
}

const workOrderInfo = computed(() => ({
  ...data.value,
  step: data.value?.step,
  viewStep: viewStep.value,
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
      <Component :is="view" v-if="!isLoading" />
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
