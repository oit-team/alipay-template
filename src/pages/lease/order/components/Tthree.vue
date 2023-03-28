<route lang="yaml">
meta:
  cache: true
  </route>

<script setup lang="ts">
import schema from './schema/t3.json'
import { getCityList, useSelectAsyncDataSource } from '@/reactions'
import { useUserStore } from '@/store/user'

const { t } = useI18n()

const queryRef = ref()

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
    showOverflowTooltip: true,
  },
  brandCarModel: {
    width: 200,
    showOverflowTooltip: true,
  },
  orderType: {
    minWidth: 100,
    showOverflowTooltip: true,
  },
  t3CreatTime: {
    width: 150,
    showOverflowTooltip: true,
  },
  actualEndDate: {
    width: 150,
    showOverflowTooltip: true,
  },
  endDate: {
    width: 150,
    showOverflowTooltip: true,
  },
  tenancy: {
    width: 150,
  },
  schemeNo: {
    width: 150,
    showOverflowTooltip: true,
  },
  carNumber: {
    width: 150,
    showOverflowTooltip: true,
  },
  driverName: {
    minWidth: 100,
    showOverflowTooltip: true,
  },
  driverMobileNumber: {
    width: 150,
    showOverflowTooltip: true,
  },
  assetCompany: {
    width: 150,
    showOverflowTooltip: true,
  },
  vinNo: {
    width: 200,
    showOverflowTooltip: true,
  },
  deliveryDate: {
    width: 200,
    showOverflowTooltip: true,
  },
  importUserName: {
    width: 200,
    showOverflowTooltip: true,
  },
  monthlyRent: {
    width: 100,
  },
  importTime: {
    width: 200,
    showOverflowTooltip: true,
  },
}

// 导入T3方案
const { files, open } = useFileDialog()

watch(files, async (value) => {
  if (!value || !value.length)
    return

  const { profile } = useUserStore()

  axios.post('/order/leaseOrder/importT3LeaseOrder', {
    file: value[0],
    userId: profile?.userId,
  }, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  })
    .then(({ data }) => {
      ElMessage.success(`${t('import.success')},${data.upDateCount},${data.addCount},${data.failureCount}`)
    })
    .catch((err) => {
      ElMessageBox.alert(err.message, '警告', {
        type: 'warning',
      })
    })
})
</script>

<template>
  <div class="h-full p-2">
    <UseQuery
      v-slot="attrs"
      :columns="columns"
      :columns-config="columnsConfig"
      :key-map="{ data: 'resultList', total: 'totalCount' }"
      :schema="schema"
      url="/order/leaseOrder/getT3LeaseOrderList"
    >
      <QueryProvide
        v-bind="attrs"
        ref="queryRef"
        auto-query="active"
      >
        <QueryForm :scope="{ getCityList, useSelectAsyncDataSource }" />
        <QueryToolbar>
          <ElButton type="primary" @click="open({ multiple: false })">
            {{ $t('button.import') }}T3租赁订单
          </ElButton>
        </QueryToolbar>
        <QueryTable>
          <template #actions>
            <QueryActionColumn v-slot="{ row }" fixed="right" label="操作" width="100px">
              <ElButton size="small" type="success" @click="$router.push(`./order/info/t-three/${row.id}`)">
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

