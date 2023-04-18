<script setup lang="ts">
import ClassifyPie from './components/ClassifyPie.vue'
import MouthTrends from './components/DriverMonthlyTrends.vue'

const { data } = useAxios('/reportForm/getDataBoardInfo')

const selectVal = ref()
</script>

<template>
  <div class="driver-warning p-2 flex flex-col gap-3 h-full">
    <ElScrollbar class="flex-1 basis-0 h-auto">
      <div class="flex">
        <ElCard class="w-2/5" header="司机分类情况" shadow="hover">
          <ClassifyPie class="aspect-5/2" :data="data?.driverClassificaInfor" />
        </ElCard>
        <ElCard class="w-3/5" header="分类司机月度趋势" shadow="hover">
          <ElSelect v-model="selectVal" class="m-2" placeholder="请选择司机分类" size="small">
            <ElOption
              v-for="(item, index) in 5"
              :key="index"
              :label="item"
              :value="item"
            />
          </ElSelect>
          <MouthTrends class="aspect-5/1" :data="data?.driverSituationTrends" />
        </ElCard>
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
