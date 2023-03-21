<script setup lang="ts">
import Step1 from './components/step-1/index.vue'
import Step2 from './components/step-2/index.vue'
import { transformResponsePush } from '@/utils/helper'

const route = useRoute()

const step = ref(0)

const view = computed(() => [Step1, Step2][step.value])

const { data } = useAxios('/workFlow/workFlow/getWorkFlowSteps', {
  method: 'POST',
  data: {
    workCode: route.query.workCode || '',
    flowCode: route.query.flowCode || 'CAR_RENTAL',
    taskCode: '',
  },
  transformResponse: transformResponsePush(data => data.body),
})

watch(() => data.value?.step, (newstep) => {
  // 接口请求step一直是1 所以 有query在进行赋值
  if (route.query.flowCode)
    step.value = newstep
})
</script>

<template>
  <div u-flex="~ col" u-h-full>
    <ElSteps
      :active="step"
      class="sticky top-0 z-10"
      finish-status="success"
      simple
      :space="200"
    >
      <ElStep v-for="item in data?.workFlowSteps" :key="item.id" :title="item.name" />
    </ElSteps>

    <ElScrollbar>
      <Component :is="view" />
    </ElScrollbar>
  </div>
</template>
