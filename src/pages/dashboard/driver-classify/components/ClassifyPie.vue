<script setup lang="ts">
import * as echarts from 'echarts/core'
import { PieChart, TreemapChart } from 'echarts/charts'
import { LegendComponent, TooltipComponent } from 'echarts/components'
import { CanvasRenderer } from 'echarts/renderers'
import type { EChartsOption } from 'echarts'
import type { DataBoardInfo } from '../../data/types'
import type { PropType } from 'vue'
import { useEcharts } from '@/composables/useEcharts'

const props = defineProps({
  data: Array as PropType<DataBoardInfo['driverClassificaInfor']>,
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
        data: props.data?.map(item => ({
          name: item.driverClassifica,
          value: item.driversNumber,
        })) ?? [],
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
