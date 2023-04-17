<script setup lang="ts">
import * as echarts from 'echarts/core'
import { BarChart, LineChart } from 'echarts/charts'
import { AxisPointerComponent, GridComponent, LegendComponent, TooltipComponent } from 'echarts/components'
import { CanvasRenderer } from 'echarts/renderers'
import dayjs from 'dayjs'
import type { EChartsOption } from 'echarts'
import type { DataBoardInfo } from '../types'
import type { PropType } from 'vue'
import { useEcharts } from '@/composables/useEcharts'

const props = defineProps({
  data: Array as PropType<DataBoardInfo['driverSituationTrends']>,
})

echarts.use([
  CanvasRenderer,
  BarChart,
  LineChart,
  TooltipComponent,
  AxisPointerComponent,
  GridComponent,
  LegendComponent,
])

const chartRef = ref()

const option = computed<EChartsOption>(() => ({
  tooltip: {
    trigger: 'item',
  },
  legend: {},
  grid: {
    left: '3%',
    right: '3%',
    bottom: '3%',
    containLabel: true,
  },
  xAxis: {
    data: props.data?.map(item => item.date) ?? [],
    axisLabel: {
      formatter: (value: string) => dayjs(value).format('M月D日'),
    },
  },
  yAxis: [
    {
      type: 'value',
    },
  ],
  series: [
    {
      name: '出车司机',
      type: 'bar',
      stack: '出车司机',
      barWidth: '50%',
      data: props.data?.map(item => item.trainDriver),
    },
    {
      name: '当日新增',
      type: 'bar',
      stack: '出车司机',
      smooth: true,
      data: props.data?.map(item => item.newOnTheSameDay),
    },
    {
      name: '司机总数',
      type: 'bar',
      stack: '出车司机',
      smooth: true,
      data: props.data?.map(item => item.totalNumberOfDrivers),
    },
    {
      name: '活跃司机',
      type: 'line',
      data: props.data?.map(item => item.activeDriver),
      label: {
        show: true,
        position: 'top',
      },
    },
  ],
}))

useEcharts(chartRef, echarts, option)
</script>

<template>
  <div ref="chartRef" v-bind="$attrs" />
  <div>
    <ElTable :data="['trainDriver', 'newOnTheSameDay', 'totalNumberOfDrivers', 'activeDriver']">
      <ElTableColumn v-slot="{ row }">
        {{ {
          trainDriver: '出车司机',
          newOnTheSameDay: '当日新增',
          totalNumberOfDrivers: '司机总数',
          activeDriver: '活跃司机',
        }[row] }}
      </ElTableColumn>
      <ElTableColumn
        v-for="(item, index) of props.data"
        :key="index"
        v-slot="{ row }"
        align="center"
        :label="dayjs(item.date).format('M月D日')"
        :prop="`${index}`"
        width="100"
      >
        {{ item[row] }}
      </ElTableColumn>
    </ElTable>
  </div>
</template>
