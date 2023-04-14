<script setup lang="ts">
import * as echarts from 'echarts/core'
import {
  GridComponent,
  TooltipComponent,
} from 'echarts/components'
import { BarChart } from 'echarts/charts'
import { CanvasRenderer } from 'echarts/renderers'
import type { EChartsOption } from 'echarts'
import type { DataBoardInfo } from '../types'
import { useEcharts } from '@/composables/useEcharts'

const props = defineProps({
  data: Array as PropType<DataBoardInfo['driverClassificationGrowth']>,
})

echarts.use([
  GridComponent,
  BarChart,
  TooltipComponent,
  CanvasRenderer,
])

const chartRef = ref()

const option = computed(() => {
  const data = props.data?.map(item => ({
    name: item.driverClassifica,
    value: item.driversNumber,
  }))
  const option: EChartsOption = {
    xAxis: {
      type: 'category',
      data: data?.map(item => item.name),
    },
    yAxis: {
      type: 'value',
    },
    series: [
      {
        data: data?.map(item => item.value),
        type: 'bar',
      },
    ],
  }
  return option
})

useEcharts(chartRef, echarts, option)
</script>

<template>
  <div ref="chartRef" />
</template>
