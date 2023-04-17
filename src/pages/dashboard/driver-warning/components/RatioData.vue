<script setup lang="ts">
import RatioCard from '../../components/RatioCard.vue'
import type { PropType } from 'vue'

defineProps({
  data: Object as PropType<any>,
})

const ratioFormat = '0[.]00%'
const doubleFormat = '0[.]00'
const moneyFormat = '0,0[.]00'

const cardItems: {
  prop: any
  title: string
  valueFormat?: string
}[] = [{
  prop: 'driveTotal',
  title: 'I级预警司机',
}, {
  prop: 'newOnTheSameDay',
  title: 'II级预警司机',
}, {
  prop: 'compliantDrivers',
  title: 'III级预警司机',
}, {
  prop: 'complianceRate',
  title: '连续未出车司机',
  valueFormat: ratioFormat,
}, {
  prop: 'driverFlow',
  title: 'I级当月入职司机',
  valueFormat: moneyFormat,
}, {
  prop: 'onlineDriver',
  title: 'II级当月入职司机',
}, {
  prop: 'activeDriver',
  title: 'III级当月入职司机',
}, {
  prop: 'onlineRate',
  title: '连续未出车当月入职司机',
  valueFormat: ratioFormat,
}, {
  prop: 'activityRate',
  title: 'I级流水负增长司机',
  valueFormat: ratioFormat,
}, {
  prop: 'completedQuantity',
  title: 'II级流水负增长司机',
}, {
  prop: 'perCapitaTravelTime',
  title: 'III级流水负增长司机',
  valueFormat: doubleFormat,
}, {
  prop: 'perCapitaServiceHours',
  title: '连续未出车流水负增长司机',
  valueFormat: doubleFormat,
}, {
  prop: 'perCapitaPeakHours',
  title: 'I级预警司机占比',
  valueFormat: doubleFormat,
}, {
  prop: 'durationEfficiency',
  title: 'II级预警司机占比',
  valueFormat: ratioFormat,
}, {
  prop: 'perCapitaFlow',
  title: 'III级预警司机占比',
  valueFormat: moneyFormat,
}, {
  prop: 'averageOrderPrice',
  title: '连续未出车司机占比',
  valueFormat: moneyFormat,
}]
</script>

<template>
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
</template>
