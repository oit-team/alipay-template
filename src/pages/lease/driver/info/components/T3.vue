<route lang="yaml">
meta:
  cache: true
      </route>

<script setup lang="ts">
import { driverParamsSymbol } from '../types'

const queryRef = ref()
const driverParams = inject(driverParamsSymbol)
const driverId = driverParams?.driverId

onMounted(() => {
  queryRef.value?.query()
})

// 表格的json
const columns = [
  {
    prop: 'orderNo',
    label: '订单编号',
  },
  {
    prop: 'orderType',
    label: '订单类型',
  },
  {
    prop: 'assetCompany',
    label: '资产公司',
  },
  {
    prop: 'city',
    label: '城市',
  },
  {
    prop: 'leasingCity',
    label: '司机ID',
  },
  {
    prop: 'driverName',
    label: '司机姓名',
  },
  {
    prop: 'driverMobileNumber',
    label: '司机手机号',
  },
  {
    prop: 'orderStatus',
    label: '订单状态',
  },
  {
    prop: 'brandCarModel',
    label: '品牌车系车型',
  },
  {
    prop: 'carNumber',
    label: '车牌号',
  },
  {
    prop: 'vinNo',
    label: '车架号',
  },
  {
    prop: 'schemeNo',
    label: '方案编号',
  },
  {
    prop: 'supplyMode',
    label: '供应方式',
  },
  {
    prop: 'tenancy',
    label: '租期',
  },
  {
    prop: 'monthlyRent',
    label: '月租',
  },
  {
    prop: 'importUserName',
    label: '数据导入用户名',
  },
  {
    prop: 'importTime',
    label: '数据导入时间',
  },
  {
    prop: 't3CreatTime',
    label: '订单创建时间',
  },
  {
    prop: 'endDate',
    label: '截至时间',
  },
  {
    prop: 'actualEndDate',
    label: '实际截至时间',
  },
  {
    prop: 'deliveryDate',
    label: '交付日期',
  },
]
const columnsConfig = {
  orderNo: {
    width: 150,
  },
  brandCarModel: {
    width: 200,
  },
  orderType: {
    minWidth: 100,
  },
  t3CreatTime: {
    width: 200,
  },
  actualEndDate: {
    width: 150,
  },
  endDate: {
    width: 150,
  },
  tenancy: {
    width: 150,
  },
  schemeNo: {
    width: 150,
  },
  carNumber: {
    width: 150,
  },
  driverName: {
    minWidth: 100,
  },
  driverMobileNumber: {
    width: 150,
  },
  assetCompany: {
    width: 150,
  },
  vinNo: {
    width: 200,
  },
  deliveryDate: {
    width: 200,
  },
  importUserName: {
    width: 200,
  },
  monthlyRent: {
    width: 100,
  },
  importTime: {
    width: 200,
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
      url="/order/leaseOrder/getT3LeaseOrderList"
    >
      <QueryProvide
        v-bind="attrs"
        ref="queryRef"
        auto-query="active"
      >
        <QueryToolbar />
        <QueryTable>
          <!-- 点击车牌号跳转到车辆详情 (有的没有车辆Id 不做跳转处理) -->
          <template #content:carNumber="{ row, value }">
            <ElLink
              v-if="row?.vehicleId"
              @click=" $router.push({
                path: `/lease/car/info/${row.vehicleId}`,
                query: { carNumber: value },
              }) "
            >
              {{ value }}
            </ElLink>
          </template>
          <template #actions>
            <QueryActionColumn v-slot="{ row }" fixed="right" label="操作" width="100px">
              <ElButton size="small" type="success" @click="$router.push(`/lease/order/info/t-three/${row.id}`)">
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

