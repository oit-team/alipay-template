<script lang="ts" setup>
import VehicleViolations from './components/VehicleViolations.vue'
import VehicleViolationsLocation from './components/VehicleViolationsLocation.vue'
import ViolationProportion from './components/ViolationProportion.vue'
import ViolationStatistics from './components/ViolationStatistics.vue'

const { data, execute, isLoading } = useAxios('/vehicle/vehicle/getViolationReportInfo', {}, { immediate: false })
const queryData = inject('queryData') as Ref<any>
watch(
  queryData,
  () => execute({ data: queryData.value }),
  {
    deep: true,
    immediate: true,
  },
)
</script>

<template>
  <ElScrollbar v-loading="isLoading" class="dashboard-data">
    <div class="w-full grid grid-cols-2 gap-2">
      <ElCard class="" header="违章行为前30名" shadow="hover">
        <VehicleViolations v-if="data?.illegalBehaviorTop30" :data="data?.illegalBehaviorTop30" />
        <ElEmpty v-else />
      </ElCard>
      <ElCard class="" header="违章地点前30名" shadow="hover">
        <VehicleViolationsLocation v-if="data?.violationAddressTop30" :data="data?.violationAddressTop30" />
        <ElEmpty v-else />
      </ElCard>
    </div>
    <div class="flex">
      <ElCard class="mr-2 w-1/3" header="违章处理情况" shadow="hover">
        <ViolationStatistics v-if="data?.violationStatistics" class="aspect-1/1" :data="data?.violationStatistics[0]" />
      </ElCard>
      <ElCard class="flex-1" header="违章占比" shadow="hover">
        <ViolationProportion v-if="data?.violationsProportion" :data="data?.violationsProportion" />
        <ElEmpty v-else />
      </ElCard>
    </div>
  </ElScrollbar>
</template>

<style lang="scss" scoped>
:deep(.dashboard-data) {
  text-align: center;

  .el-card__header {
    @apply: text-primary font-bold;
  }
}
</style>
