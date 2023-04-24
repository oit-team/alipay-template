<script setup lang="ts">
import { useFlowOption } from '../hooks/useFlowOption'

const flowOption = useFlowOption()
</script>

<template>
  <ElSteps
    :active="flowOption?.step"
    class="sticky top-0 z-10"
    finish-status="success"
    simple
  >
    <ElStep
      v-for="(item) of flowOption?.workFlowSteps"
      :key="item.id"
      :class="{ 'step--active': flowOption?.stepCodeActive === item.taskCode }"
      :status="item.clickEnable ? '' : 'wait'"
      :title="item.name"
      @click="flowOption?.setViewStep(item)"
    />
  </ElSteps>
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
