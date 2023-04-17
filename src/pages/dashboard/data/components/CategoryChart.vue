<script setup lang="ts">
import * as echarts from 'echarts/core'
import { TreemapChart } from 'echarts/charts'
import { TooltipComponent } from 'echarts/components'
import { CanvasRenderer } from 'echarts/renderers'
import type { EChartsOption } from 'echarts'
import type { DataBoardInfo } from '../types'
import type { PropType } from 'vue'
import { useEcharts } from '@/composables/useEcharts'

const props = defineProps({
  data: Object as PropType<DataBoardInfo['driverClassificaInfor']>,
})

echarts.use([
  CanvasRenderer,
  TreemapChart,
  TooltipComponent,
])

const chartRef = ref()

const option = computed(() => {
  const data = Object.entries(props.data ?? {})
    .map(([name, { driversNumber }]) => ({
      name: `${name}类司机`,
      value: driversNumber,
    }))
  const option: EChartsOption = {
    tooltip: {
      trigger: 'item',
    },
    series: [
      {
        type: 'treemap',
        roam: false,
        nodeClick: undefined,
        universalTransition: true,
        label: {
          show: true,
        },
        breadcrumb: {
          show: false,
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
