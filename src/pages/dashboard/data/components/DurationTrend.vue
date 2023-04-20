<script setup lang="ts">
import * as echarts from 'echarts/core'
import { BarChart, LineChart } from 'echarts/charts'
import { AxisPointerComponent, GridComponent, LegendComponent, TooltipComponent } from 'echarts/components'
import { CanvasRenderer } from 'echarts/renderers'
import dayjs from 'dayjs'
import { UniversalTransition } from 'echarts/features'
import type { EChartsOption } from 'echarts'
import type { DataBoardInfo } from '../types'

import { useEcharts } from '@/composables/useEcharts'

const props = defineProps({
  data: Array as PropType<DataBoardInfo['durationTrend']>,
})

echarts.use([
  CanvasRenderer,
  BarChart,
  LineChart,
  TooltipComponent,
  AxisPointerComponent,
  GridComponent,
  LegendComponent,
  UniversalTransition,
])

const chartRef = ref()

const option = computed<EChartsOption>(() => {
  return {
    tooltip: {
      trigger: 'item',
      axisPointer: {
        type: 'cross',
        label: {
          backgroundColor: '#6a7985',
        },
      },
    },
    legend: {},
    grid: {
      left: '5%',
      right: '3%',
      bottom: '3%',
      containLabel: true,
    },
    xAxis: {
      type: 'category',
      boundaryGap: false,
      data: props.data?.map(item => item?.effectiveDurationRate?.date) ?? [],
      axisLabel: {
        interval: 0,
        rotate: 30,
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
        name: '人均在线时长',
        type: 'line',
        stack: 'Total',
        areaStyle: {},
        emphasis: {
          focus: 'series',
        },
        data: props.data?.map((item: any) => item?.perCapitaOnlineSh?.value ?? 0),
      },
      {
        name: '人均服务时长',
        type: 'line',
        stack: 'Total',
        areaStyle: {},
        emphasis: {
          focus: 'series',
        },
        data: props.data?.map((item: any) => item?.perCapitaServiceHours?.value ?? 0),
      },
      {
        name: '人均高峰时长',
        type: 'line',
        stack: 'Total',
        areaStyle: {},
        emphasis: {
          focus: 'series',
        },
        data: props.data?.map((item: any) => item?.perCapitaPeakHours?.value ?? 0),
      },
      {
        name: '有效时长率',
        type: 'line',
        stack: 'Total',
        areaStyle: {},
        emphasis: {
          focus: 'series',
        },
        label: {
          show: true,
          position: 'top',
        },
        data: props.data?.map((item: any) => item?.effectiveDurationRate?.value ?? 0),
      },
    ],
  }
})

useEcharts(chartRef, echarts, option)
</script>

<template>
  <div ref="chartRef" />
</template>
