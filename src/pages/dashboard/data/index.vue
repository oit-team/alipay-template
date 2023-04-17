<script setup lang="ts">
import Query from '../components/Query.vue'
import RatioData from './components/RatioData.vue'
import CategoryChart from './components/CategoryChart.vue'
import DailyGrowthChart from './components/DailyGrowthChart.vue'
import OrderAndTransactionChart from './components/OrderAndTransactionChart.vue'
import DriverSituationTrends from './components/DriverSituationTrends.vue'
import type { DataBoardInfo } from './types'

const { data, execute } = useAxios<DataBoardInfo>('/reportForm/getDataBoardInfo')
</script>

<template>
  <div class="p-2 flex flex-col gap-3 h-full dashboard-data">
    <Query @query="(data) => execute({ data })" />
    <ElScrollbar class="flex-1 basis-0 h-auto">
      <div class="grid grid-cols-5 gap-3">
        <RatioData :data="data?.bulletinBoard" />
        <ElCard class="col-start-[span_3] row-start-4 row-end-6" header="司机分类情况" shadow="hover">
          <CategoryChart class="aspect-16/9" :data="data?.driverClassificaInfor" />
        </ElCard>
        <ElCard class="col-start-[span_2] row-start-5" header="司机分类日增长情况" shadow="hover">
          <DailyGrowthChart class="aspect-16/9" :data="data?.driverClassificationGrowth" />
        </ElCard>
        <ElCard class="col-start-[span_5]" header="流水&订单趋势" shadow="hover">
          <OrderAndTransactionChart class="aspect-5/1" :data="data?.flowAndOrderTrends" />
        </ElCard>
        <ElCard class="col-start-[span_5]" header="司机情况趋势" shadow="hover">
          <DriverSituationTrends class="aspect-5/1" :data="data?.driverSituationTrends" />
        </ElCard>
        <div />
      </div>
    </ElScrollbar>
  </div>
</template>

<style lang="scss" scoped>
.dashboard-data:deep() {
  text-align: center;

  .el-card__header {
    @apply: text-primary font-bold;
  }
}
</style>
