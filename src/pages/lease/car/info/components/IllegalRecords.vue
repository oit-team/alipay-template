<route lang="yaml">
meta:
  cache: true
  </route>

<script setup lang="ts">
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
    showOverflowTooltip: true,
  },
  companyName: {
    width: 150,
    showOverflowTooltip: true,
  },
  plateNumber: {
    width: 150,
    showOverflowTooltip: true,
  },
  violationTime: {
    width: 150,
    showOverflowTooltip: true,
  },
  codeOfViolation: {
    width: 150,
    showOverflowTooltip: true,
  },
  violationScore: {
    width: 150,
    showOverflowTooltip: true,
  },
  forfeit: {
    width: 150,
    showOverflowTooltip: true,
  },
  illegalBehavior: {
    width: 150,
    showOverflowTooltip: true,
  },
  violationAddress: {
    width: 150,
    showOverflowTooltip: true,
  },
  gatherOrgan: {
    width: 150,
    showOverflowTooltip: true,
  },
  disposeState: {
    width: 150,
    showOverflowTooltip: true,
  },
  violationRecordNumber: {
    width: 150,
    showOverflowTooltip: true,
  },
  disposeTime: {
    width: 150,
    showOverflowTooltip: true,
  },
  queryTime: {
    width: 150,
    showOverflowTooltip: true,
  },
}

const queryRef = ref()

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
        vehicleId: $route.params.id,
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
