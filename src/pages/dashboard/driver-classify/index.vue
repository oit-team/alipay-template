<script setup lang="ts">
import { toLower, toUpper } from 'lodash'
import Query from '../components/Query.vue'
import DataItem from '../components/DataItem.vue'
import ClassifyPie from './components/ClassifyPie.vue'
import MouthTrends from './components/DriverMonthlyTrends.vue'
import { Format } from '@/utils/numeral'

const { data, execute } = useAxios('/vehicle/reportForm/getDriverClassificationReport')
const selectVal = ref()
watch(data, () => {
  selectVal.value ??= data.value?.driverTypeList[0]
})
</script>

<template>
  <div class="p-2 flex flex-col gap-3 h-full">
    <Query @query="(data) => execute({ data })" />

    <ElScrollbar class="flex-1 basis-0 h-auto text-center">
      <div class="grid grid-cols-5 gap-3">
        <ElCard v-for="(group, key) of data?.driverClassificaData" :key="key" class="col-start-[span_5]" shadow="hover">
          <template #header>
            <div class="flex gap-3">
              <div>{{ toUpper(key.toString()) }}类</div>
              <ElTag>
                <span>UP司机：</span>
                <span>{{ `${group.uPB.minVal}<流水≤${group.uPB.maxVal}` }}</span>
              </ElTag>
              <ElTag>
                <span>加盟司机：</span>
                <span>{{ `${group.uPA.minVal}<流水≤${group.uPA.maxVal}` }}</span>
              </ElTag>
            </div>
          </template>
          <div class="grid grid-cols-8 gap-5">
            <div
              v-for="item of [{
                label: '司机总数',
                prop: 'totalNumberOfDrivers',
              }, {
                label: '合规司机',
                prop: 'compliantDrivers',
              }, {
                label: '司机流水',
                prop: 'driverFlow',
                format: Format.Money,
              }, {
                label: '人均流水',
                prop: 'perCapitaFlow',
                format: Format.Money,
              }, {
                label: '人均在线时长',
                prop: 'perCapitaOnlineDuration',
              }, {
                label: '人均服务时长',
                prop: 'perCapitaServiceHours',
              }, {
                label: '人均高峰时长',
                prop: 'perCapitaPeakHours',
              }, {
                label: '服务时长有效率',
                prop: 'serviceDurationEffectiveRatio',
                format: Format.Percentage,
              }]"
              :key="item.prop"
            >
              <div class="py-3">
                {{ item.label }}
              </div>
              <DataItem
                class="h-140px"
                column
                :ratio1="group[item.prop]?.monthToMonth"
                :ratio2="group[item.prop]?.yearToYear"
                :value="group[item.prop]?.value"
                :value-format="item.format"
              />
            </div>
          </div>
        </ElCard>
        <ElCard class="col-start-[span_1]" header="司机分类情况" shadow="hover">
          <ClassifyPie class="aspect-1/1" :data="data?.driverClassifica" />
        </ElCard>
        <ElCard class="col-start-[span_4]" header="分类司机月度趋势" shadow="hover">
          <ElSelect v-model="selectVal" class="m-2" placeholder="请选择司机分类" size="small">
            <ElOption
              v-for="(item, index) in data?.driverTypeList"
              :key="index"
              :label="item"
              :value="item"
            />
          </ElSelect>
          <MouthTrends class="aspect-5/1" :classify="toLower(selectVal)" :data="data?.driverClassificationTrend" />
        </ElCard>
      </div>
    </ElScrollbar>
  </div>
</template>
