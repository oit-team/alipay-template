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
  data: Array as PropType<DataBoardInfo['perCapitaOrderTrend']>,
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
    data: props.data?.map(item => item?.date) ?? [],
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
      name: '人均完单',
      type: 'bar',
      data: props.data?.map(item => item?.perCapitaOrders ?? 0),
    },
    {
      name: '单均价',
      type: 'bar',
      data: props.data?.map(item => item?.averageOrderPrice ?? 0),
    },
    {
      name: '人均流水',
      type: 'line',
      data: props.data?.map(item => item?.perCapitaFlow ?? 0),
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
    <ElTable border :data="['perCapitaOrders', 'averageOrderPrice', 'perCapitaFlow']">
      <ElTableColumn v-slot="{ row }" fixed width="100">
        {{ ({
          perCapitaOrders: '人均完单',
          averageOrderPrice: '单均价',
          perCapitaFlow: '人均流水',
        } as any)[row] }}
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
        {{ (item as any)[row] ?? '-' }}
      </ElTableColumn>
    </ElTable>
  </div>
</template>
