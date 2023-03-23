<route lang="yaml">
meta:
  cache: true
    </route>

<script setup lang="ts">
const route = useRoute()

const queryRef = ref()

const columns = [
  {
    prop: 'leaseOrderNo',
    label: '订单编号',
  },
  {
    prop: 'orderStatue',
    label: '订单状态',
  },
  {
    prop: 'driverName',
    label: '司机姓名',
  },
  {
    prop: 'licensePlateNumber',
    label: '车牌号',
  },
  {
    prop: 'vinNo',
    label: '车架号',
  },
  {
    prop: 'caseCode',
    label: '方案编号',
  },
  {
    prop: 'rent',
    label: '租金（元）',
  },
  {
    prop: 'cashPledge',
    label: '押金（元）',
  },
  {
    prop: 'startTime',
    label: '起租日期',
  },
  {
    prop: 'endTime',
    label: '终止时间',
  },
  {
    prop: 'createTime',
    label: '创建时间',
  },
  {
    prop: 'updateTime',
    label: '更新时间',
  },
]
const columnsConfig = {
  caseCode: {
    width: 200,
    showOverflowTooltip: true,
  },
  leaseTerm: {
    width: 150,
    showOverflowTooltip: true,
  },
  cashPledge: {
    width: 100,
  },
  updateTime: {
    width: 150,
    showOverflowTooltip: true,
  },
  vinNo: {
    width: 150,
    showOverflowTooltip: true,
  },
  rent: {
    width: 100,
  },
  leaseOrderNo: {
    width: 150,
    showOverflowTooltip: true,
  },
  licensePlateNumber: {
    width: 100,
  },
  createTime: {
    width: 150,
    showOverflowTooltip: true,
  },
  driverName: {
    width: 100,
  },
  startTime: {
    width: 150,
    showOverflowTooltip: true,
  },
  orderStatue: {
    width: 100,
  },
  endTime: {
    width: 150,
    showOverflowTooltip: true,
  },
}
</script>

<template>
  <div class="h-full p-2">
    <UseQuery
      v-slot="attrs"
      :columns="columns"
      :columns-config="columnsConfig"
      :data="{
        vehicleId: route.params.id,
      }"
      :key-map="{ data: 'resultList', total: 'totalCount' }"
      url="/order/leaseOrder/getLeaseOrderList"
    >
      <QueryProvide
        v-bind="attrs"
        ref="queryRef"
        auto-query="active"
      >
        <!-- <QueryForm /> -->
        <QueryTable />
        <QueryPagination />
      </QueryProvide>
    </UseQuery>
  </div>
</template>

