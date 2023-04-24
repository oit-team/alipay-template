<script setup lang="ts">
import RatioCard from '../../components/RatioCard.vue'
import type { PropType } from 'vue'

defineProps({
  data: Object as PropType<any>,
})
// 环比 monthToMonth
// 同比 yearToYear

const titleMap = {
  L1: {
    warningDrivers: 'I级预警司机（人）',
    newEmployeesNumber: 'I级当月入职司机（人）',
    negativeGrowth: 'I级流水负增长司机（人）',
    warningRatio: 'I级预警司机占比',
  },
  L2: {
    warningDrivers: 'II级预警司机（人）',
    newEmployeesNumber: 'II级当月入职司机（人）',
    negativeGrowth: 'II级流水负增长司机（人）',
    warningRatio: 'II级预警司机占比',
  },
  L3: {
    warningDrivers: 'III级预警司机（人）',
    newEmployeesNumber: 'III级当月入职司机（人）',
    negativeGrowth: 'III级流水负增长司机（人）',
    warningRatio: 'III级预警司机占比',
  },
  L4: {
    warningDrivers: '连续未出车司机（人）',
    newEmployeesNumber: '连续未出车当月入职司机（人）',
    negativeGrowth: '连续未出车流水负增长司机（人）',
    warningRatio: '连续未出车司机占比',
  },
}

// 对每列最后一项百分比格式化
const format = {
  warningRatio: '0[.]00%',
}
</script>

<template>
  <template
    v-for="(group, groupKey) of titleMap"
    :key="groupKey"
  >
    <template
      v-for="(title, key) of group"
      :key="key"
    >
      <RatioCard
        :header="title"
        :ratio1="data?.[groupKey]?.[key]?.monthToMonth"
        :ratio2="data?.[groupKey]?.[key]?.yearToYear"
        :value="data?.[groupKey]?.[key]?.driverNum"
        :value-format="format[key]"
      />
    </template>
  </template>
</template>
