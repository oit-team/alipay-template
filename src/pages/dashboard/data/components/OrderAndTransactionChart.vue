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
  data: Array as PropType<DataBoardInfo['flowAndOrderTrends']>,
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
      name: '订单',
      type: 'bar',
      barWidth: '50%',
      data: props.data?.map(item => item.orderNum ?? 0),
    },
    {
      name: '流水',
      type: 'line',
      data: props.data?.map(item => item.amounts ?? 0),
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
  <div ref="chartRef" />
</template>
