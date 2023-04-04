<route lang="yaml">
meta:
  cache: false
  </route>

<script setup lang="ts">
import { driverParamsSymbol } from '../types'

const driverParams = inject(driverParamsSymbol)
const driverId = driverParams?.driverId

const queryRef = ref()

onMounted(() => {
  queryRef.value?.query()
})

const columns = [
  {
    prop: 'leaseOrderNo',
    label: '订单编号',
  },
  {
    prop: 'orderStatueName',
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
    width: 150,
  },
  leaseTerm: {
    width: 150,
  },
  cashPledge: {
    minWidth: 150,
  },
  updateTime: {
    width: 150,
  },
  vinNo: {
    width: 150,
  },
  rent: {
    minWidth: 150,
  },
  leaseOrderNo: {
    width: 150,
  },
  licensePlateNumber: {
    width: 150,
  },
  createTime: {
    width: 150,
  },
  driverName: {
    minWidth: 150,
  },
  startTime: {
    width: 150,
  },
  orderStatue: {
    width: 150,
  },
  orderStatueName: {
    width: 150,
  },
  endTime: {
    width: 150,
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
        driverId,
      }"
      :key-map="{ data: 'resultList', total: 'totalCount' }"
      url="/order/leaseOrder/getLeaseOrderList"
    >
      <QueryProvide
        v-bind="attrs"
        ref="queryRef"
        auto-query="active"
      >
        <QueryTable>
          <template #actions>
            <QueryActionColumn v-slot="{ row }" fixed="right" label="操作" width="100px">
              <ElButton size="small" type="success" @click="$router.push(`/lease/order/info/self-support/${row.id}`)">
                {{ $t('button.info') }}
              </ElButton>
            </QueryActionColumn>
          </template>
        </QueryTable>
        <QueryPagination />
      </QueryProvide>
    </UseQuery>
  </div>
</template>

