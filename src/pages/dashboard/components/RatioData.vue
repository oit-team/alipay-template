<script setup lang="ts">
import RatioCard from './RatioCard.vue'
import type { DataBoardInfo } from '../data/types'
import type { PropType } from 'vue'

defineProps({
  data: Object as PropType<DataBoardInfo['bulletinBoard']>,
})

const ratioFormat = '0[.]00%'
const doubleFormat = '0[.]00'
const moneyFormat = '0,0[.]00'

const cardItems: {
  prop: keyof DataBoardInfo['bulletinBoard']
  title: string
  valueFormat?: string
}[] = [{
  prop: 'driveTotal',
  title: '司机总数',
}, {
  prop: 'newOnTheSameDay',
  title: '当日新增',
}, {
  prop: 'compliantDrivers',
  title: '合规司机',
}, {
  prop: 'complianceRate',
  title: '合规率',
  valueFormat: ratioFormat,
}, {
  prop: 'driverFlow',
  title: '司机流水',
  valueFormat: moneyFormat,
}, {
  prop: 'onlineDriver',
  title: '出车司机',
}, {
  prop: 'activeDriver',
  title: '活跃司机',
}, {
  prop: 'onlineRate',
  title: '出车率',
  valueFormat: ratioFormat,
}, {
  prop: 'activityRate',
  title: '活跃率',
  valueFormat: ratioFormat,
}, {
  prop: 'completedQuantity',
  title: '司机完单',
}, {
  prop: 'perCapitaTravelTime',
  title: '人均出车时长',
  valueFormat: doubleFormat,
}, {
  prop: 'perCapitaServiceHours',
  title: '人均服务时长',
  valueFormat: doubleFormat,
}, {
  prop: 'perCapitaPeakHours',
  title: '人均高峰时长',
  valueFormat: doubleFormat,
}, {
  prop: 'durationEfficiency',
  title: '时长有效率',
  valueFormat: ratioFormat,
}, {
  prop: 'perCapitaFlow',
  title: '人均流水',
  valueFormat: moneyFormat,
}, {
  prop: 'averageOrderPrice',
  title: '订单均价',
  valueFormat: moneyFormat,
}, {
  prop: 'perCapitaCompletionOfOrders',
  title: '人均完单',
  valueFormat: doubleFormat,
}]
</script>

<template>
  <div class="grid grid-cols-5 gap-3">
    <template
      v-for="item of cardItems"
      :key="item.prop"
    >
      <RatioCard
        :header="item.title"
        :ratio1="data?.[item.prop]?.monthToMonth"
        :ratio2="data?.[item.prop]?.yearToYear"
        :value="data?.[item.prop]?.value"
        :value-format="item?.valueFormat"
      />
    </template>
  </div>
</template>
