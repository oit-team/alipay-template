<script setup lang="ts">
import * as echarts from 'echarts/core'
import { BarChart, LineChart } from 'echarts/charts'
import { AxisPointerComponent, GridComponent, TooltipComponent } from 'echarts/components'
import { CanvasRenderer } from 'echarts/renderers'
import dayjs from 'dayjs'
import type { EChartsOption } from 'echarts'
import { useEcharts } from '@/composables/useEcharts'

const props = defineProps({
  data: Array,
  classify: String,
})

echarts.use([
  CanvasRenderer,
  BarChart,
  LineChart,
  TooltipComponent,
  AxisPointerComponent,
  GridComponent,
])

const chartRef = ref()

const option = computed<EChartsOption>(() => {
  return {
    tooltip: {
      trigger: 'item',
    },
    grid: {
      left: '3%',
      right: '3%',
      bottom: '3%',
      containLabel: true,
    },
    xAxis: {
      data: props.data?.map((item: any) => item.date) ?? [],
      axisLabel: {
        interval: 0,
        rotate: 30,
        formatter: (value: string) => dayjs(value).format('D日'),
      },
    },
    yAxis: [
      {
        type: 'value',
      },
    ],
    series: [
      {
        name: '活跃司机',
        type: 'line',
        data: props.classify
          ? props.data?.map((item: any) => item[props.classify as string])
          : [],
        label: {
          show: true,
          position: 'top',
        },
      },
    ],
  }
})

useEcharts(chartRef, echarts, option)
</script>

<template>
  <div ref="chartRef" />
</template>
