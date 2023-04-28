<script setup lang="ts">
import Vehicle from './components/Vehicle.vue'

const { data, execute, isLoading } = useAxios('/vehicle/reportForm/getVehicleRentalRate', {}, { immediate: false })
const queryData = inject('queryData') as Ref<any>
watchImmediate(queryData, () => execute({ data: queryData.value }))
</script>

<template>
  <ElScrollbar v-loading="isLoading" class="dashboard-data">
    <div class="">
      <ElCard class="col-start-[span_3] row-start-4 row-end-6" header="车辆出租率" shadow="hover">
        <Vehicle class="w-full h-500px" :data="data?.result" />
      </ElCard>
    </div>
  </ElScrollbar>
</template>

<style lang="scss" scoped>

</style>
