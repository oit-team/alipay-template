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
  const data = [{
    name: '已处理',
    value: props.data?.completed || 0,
  }, {
    name: '未完结',
    value: props.data?.incomplete || 0,
  }]
  const option: EChartsOption = {
    color: [
      '#91cc75',
      '#ee6666',
      '#fc8452',
    ],
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
