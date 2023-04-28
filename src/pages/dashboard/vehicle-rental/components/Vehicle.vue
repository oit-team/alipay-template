<script setup lang="ts">
import * as echarts from 'echarts/core'
import { BarChart, LineChart } from 'echarts/charts'
import { AxisPointerComponent, GridComponent, LegendComponent, TooltipComponent } from 'echarts/components'
import { CanvasRenderer } from 'echarts/renderers'
import dayjs from 'dayjs'
import type { EChartsOption } from 'echarts'
import { useEcharts } from '@/composables/useEcharts'

const props = defineProps({
  data: Array as any,
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
    data: props.data?.map((item: { date: any }) => item.date) ?? [],
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
      name: '已租',
      type: 'bar',
      stack: '出车司机',
      barWidth: '50%',
      data: props.data?.map((item: { rentedTotal: any }) => item.rentedTotal ?? 0),
    },
    {
      name: '待租',
      type: 'bar',
      stack: '出车司机',
      smooth: true,
      data: props.data?.map((item: { rentTotal: any }) => item.rentTotal ?? 0),
    },
    {
      name: '总数',
      type: 'bar',
      stack: '出车司机',
      smooth: true,
      data: props.data?.map((item: { totalNumber: any }) => item.totalNumber ?? 0),
    },
    {
      name: '占比',
      type: 'line',
      data: props.data?.map((item: { rentedProportion: any }) => item.rentedProportion ?? 0),
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
    <ElTable border :data="['rentedTotal', 'rentTotal', 'totalNumber', 'rentedProportion']">
      <ElTableColumn v-slot="{ row }" fixed width="100">
        {{ {
          rentedTotal: '已租',
          rentTotal: '待租',
          totalNumber: '总数',
          rentedProportion: '占比',
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
        {{ item[row] ?? '-' }}
      </ElTableColumn>
    </ElTable>
  </div>
</template>
