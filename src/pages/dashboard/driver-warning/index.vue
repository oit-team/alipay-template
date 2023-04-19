<script setup lang="ts">
import RatioData from './components/RatioData.vue'

const { data, execute, isLoading } = useAxios('/vehicle/reportForm/getWarningDataPanel', {}, { immediate: false })
const queryData = inject('queryData') as Ref<any>
watchImmediate(queryData, () => execute({ data: queryData.value }))
</script>

<template>
  <ElScrollbar v-loading="isLoading" class="driver-warning">
    <div class="grid grid-cols-4 grid-rows-4 gap-3 grid-flow-col">
      <RatioData :data="data" />
    </div>
  </ElScrollbar>
</template>

<style lang="scss" scoped>
.driver-warning:deep() {
  text-align: center;

  .el-card__header {
    @apply: text-primary font-bold;
  }
}
</style>
