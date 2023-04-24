<script lang="ts" setup>
const isLoading = ref(false)
// const { data, execute, isLoading } = useAxios('/vehicle/reportForm/getDataBoardInfo', {}, { immediate: false })
// const queryData = inject('queryData') as Ref<any>
// watchImmediate(queryData, () => execute({ data: queryData.value }))
</script>

<template>
  <ElScrollbar v-loading="isLoading" class="dashboard-data">
    <ElCard class="col-start-[span_2] row-start-5" header="各城市违章行为前30名" shadow="hover">
      <!-- <DailyGrowthChart v-if="data?.driverClassificaInfor" class="aspect-16/9" :data="data?.driverClassificationGrowth" />
      <ElEmpty v-else /> -->
      4444
    </ElCard>
    <ElCard class="col-start-[span_2] row-start-5" header="各城市违章地点前30名" shadow="hover">
      555
    </ElCard>
  </ElScrollbar>
</template>

<style lang="scss" scoped>
.dashboard-data:deep() {
  text-align: center;

  .el-card__header {
    @apply: text-primary font-bold;
  }
}
</style>
