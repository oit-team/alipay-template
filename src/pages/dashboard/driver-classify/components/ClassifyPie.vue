<script setup lang="ts">
import * as echarts from 'echarts/core'
import { PieChart, TreemapChart } from 'echarts/charts'
import { LegendComponent, TooltipComponent } from 'echarts/components'
import { CanvasRenderer } from 'echarts/renderers'
import type { EChartsOption } from 'echarts'
import { useEcharts } from '@/composables/useEcharts'

const props = defineProps({
  data: Object,
})

echarts.use([
  CanvasRenderer,
  TreemapChart,
  TooltipComponent,
  LegendComponent,
  PieChart,
])

const chartRef = ref()

const option = computed<EChartsOption>(() => {
  const data = props.data?.map((item: any) => ({
    name: `${item.driverCategory}类司机`,
    value: item.countVal ?? 0,
  }))
  const option: EChartsOption = {
    tooltip: {
      trigger: 'item',
    },
    legend: {
      orient: 'vertical',
      left: 'left',
    },
    emphasis: {
      itemStyle: {
        shadowBlur: 10,
        shadowOffsetX: 0,
        shadowColor: 'rgba(0, 0, 0, 0.5)',
      },
    },
    series: [
      {
        type: 'pie',
        radius: '80%',
        label: {
          show: true,
        },
        data,
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
