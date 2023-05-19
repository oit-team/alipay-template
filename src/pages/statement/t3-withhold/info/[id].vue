<script setup lang="ts">
const route = useRoute()

const T3WithholdMap = [
  {
    prop: 'driverName',
    label: '姓名',
  },
  {
    prop: 'driverId',
    label: '司机ID',
  },
  {
    prop: 'licensePlate',
    label: '车牌号',
  },
  {
    prop: 'statementNumber',
    label: '账单编号',
  },
  {
    prop: 'associatedOrder',
    label: '关联订单',
  },
  {
    prop: 'nowLeaseTerm',
    label: '当前租期',
  },
  {
    prop: 'accountPeriod',
    label: '账期',
  },
  {
    prop: 'monthlyRent',
    label: '月租金',
  },
  {
    prop: 'city',
    label: '城市',
  },
  {
    prop: 'cityassetCompany',
    label: '资产公司',
  },
  {
    prop: 'payee',
    label: '收款单位',
  },
  {
    prop: 'bank',
    label: '开户行',
  },
]

const { data } = useAxios('/order/withholding/getWithholdingMap', {
  method: 'POST',
  data: { statementNumber: route.params.id },
})
</script>

<template>
  <div u-h-full>
    <PageHeader title="T3代扣详情" />
    <Descriptions
      border
      :data="data?.resultMap"
      default-text="无"
      label-width="180px"
      :options="T3WithholdMap"
    />
  </div>
</template>
