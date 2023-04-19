<script setup lang="ts">
import Query from '../components/Query.vue'
import DataItem from '../components/DataItem.vue'
import ClassifyPie from './components/ClassifyPie.vue'
import MouthTrends from './components/DriverMonthlyTrends.vue'

const { data } = useAxios('/reportForm/getDataBoardInfo')

const selectVal = ref()
</script>

<template>
  <div class="p-2 flex flex-col gap-3 h-full">
    <Query />

    <ElScrollbar class="flex-1 basis-0 h-auto text-center">
      <div class="grid grid-cols-5 gap-3">
        <ElCard v-for="i of 5" :key="i" class="col-start-[span_5]" shadow="hover">
          <template #header>
            <div class="flex gap-6">
              <div>A类</div>
              <div>
                <span>UP司机：</span>
                <span>流水>400</span>
                <span class="ml-3">加盟司机：</span>
                <span>流水>400</span>
              </div>
            </div>
          </template>
          <div class="grid grid-cols-8 gap-5">
            <div v-for="i of 8" :key="i">
              <div class="py-3">
                司机总数
              </div>
              <DataItem class="h-140px" column />
            </div>
          </div>
        </ElCard>
        <ElCard class="col-start-[span_2]" header="司机分类情况" shadow="hover">
          <ClassifyPie class="aspect-5/2" :data="data?.driverClassificaInfor" />
        </ElCard>
        <ElCard class="col-start-[span_3]" header="分类司机月度趋势" shadow="hover">
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
