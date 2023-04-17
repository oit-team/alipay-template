<script setup lang="ts">
import Query from '../components/Query.vue'
import RatioData from './components/RatioData.vue'

const { data, execute } = useAxios('/reportForm/getDataBoardInfo')
</script>

<template>
  <div class="driver-warning p-2 flex flex-col gap-3 h-full">
    <Query @query="data => execute({ data })" />
    <ElScrollbar class="flex-1 basis-0 h-auto">
      <div class="grid grid-cols-5 gap-3">
        <RatioData :data="data" />
      </div>
    </ElScrollbar>
  </div>
</template>

<style lang="scss" scoped>
.driver-warning:deep() {
  text-align: center;

  .el-card__header {
    @apply: text-primary font-bold;
  }
}
</style>
