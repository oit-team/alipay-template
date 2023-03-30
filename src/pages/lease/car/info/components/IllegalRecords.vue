<route lang="yaml">
meta:
  cache: true
  </route>

<script setup lang="ts">
import { vehicleParamsSymbol } from '../types'

const columns = [
  {
    prop: 'projectName',
    label: '项目',
  },
  {
    prop: 'companyName',
    label: 'DP',
  },
  {
    prop: 'plateNumber',
    label: '车牌',
  },
  {
    prop: 'violationTime',
    label: '违法时间',
  },
  {
    prop: 'violationAddress',
    label: '违法地点',
  },
  {
    prop: 'illegalBehavior',
    label: '违法行为',
  },
  {
    prop: 'violationRecordNumber',
    label: '违法记录号',
  },
  {
    prop: 'codeOfViolation',
    label: '违法行为代码',
  },
  {
    prop: 'violationScore',
    label: '违法记分',
  },
  {
    prop: 'forfeit',
    label: '罚款金额',
  },
  {
    prop: 'gatherOrgan',
    label: '采集机关',
  },
  {
    prop: 'disposeState',
    label: '处理状态',
  },
  {
    prop: 'disposeTime',
    label: '处理时间',
  },
  {
    prop: 'queryTime',
    label: '查询时间',
  },
]
const columnsConfig = {
  projectName: {
    width: 150,
  },
  companyName: {
    width: 150,
  },
  plateNumber: {
    width: 150,
  },
  violationTime: {
    width: 150,
  },
  codeOfViolation: {
    width: 150,
  },
  violationScore: {
    minWidth: 150,
  },
  forfeit: {
    width: 150,
  },
  illegalBehavior: {
    width: 150,
  },
  violationAddress: {
    width: 150,
  },
  gatherOrgan: {
    width: 150,
  },
  disposeState: {
    width: 150,
  },
  violationRecordNumber: {
    width: 150,
  },
  disposeTime: {
    width: 150,
  },
  queryTime: {
    width: 150,
  },
}

const queryRef = ref()
const vehicleParams = inject(vehicleParamsSymbol)
const vehicleId = vehicleParams?.vehicleId

onMounted(() => {
  queryRef.value?.query()
})
</script>

<template>
  <div class="h-full p-2">
    <UseQuery
      v-slot="attrs"
      :columns="columns"
      :columns-config="columnsConfig"
      :data="{
        vehicleId,
      }"
      :key-map="{ data: 'resultList', total: 'totalCount' }"
      url="/vehicle/vehicle/getViolationInfo"
    >
      <QueryProvide
        v-bind="attrs"
        ref="queryRef"
        auto-query="active"
      >
        <QueryTable />
        <QueryPagination />
      </QueryProvide>
    </UseQuery>
  </div>
</template>
