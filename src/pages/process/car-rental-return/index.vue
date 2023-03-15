<script setup lang="ts">
import Step1 from './components/step-1/index.vue'
import Step2 from './components/step-2/index.vue'

const step = ref(1)

const view = computed(() => [Step1, Step2][step.value])
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
      <ElStep title="申请退车" />
      <ElStep title="验车" />
      <ElStep title="维修" />
      <ElStep title="入库确认" />
    </ElSteps>

    <ElScrollbar>
      <Component :is="view" />
    </ElScrollbar>
  </div>
</template>
