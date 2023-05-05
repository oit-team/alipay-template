<route lang="yaml">
meta:
  cache: false
  </route>

<script setup lang="ts">
import { vehicleParamsSymbol } from '../types'

const vehicleParams = inject(vehicleParamsSymbol)
const vehicleId = vehicleParams?.vehicleId

const schema = {
  'type': 'object',
  'properties': {
    xzzo5vwr3ge: {
      'type': 'void',
      'x-component': 'FormGrid',
      'x-validator': [],
      'x-component-props': {
        maxColumns: 4,
        minColumns: 4,
      },
      'x-designable-id': 'xzzo5vwr3ge',
      'properties': {
        t3DriverId: {
          'type': 'string',
          'title': '司机id',
          'x-decorator': 'FormItem',
          'x-component': 'Input',
          'x-validator': [],
          'x-component-props': {},
          'x-decorator-props': {},
          'name': 't3DriverId',
          'x-designable-id': '51rqtyb947n',
          'x-index': 0,
        },
        statisticalDate: {
          'type': 'string[]',
          'title': '统计日期',
          'x-decorator': 'FormItem',
          'x-component': 'DatePicker',
          'x-validator': [],
          'x-component-props': {
            type: 'daterange',
          },
          'x-decorator-props': {},
          'name': 'statisticalDate',
          'x-designable-id': '21vo4n34ft9',
          'x-index': 1,
        },
        createTime: {
          'type': 'string[]',
          'title': '入库日期',
          'x-decorator': 'FormItem',
          'x-component': 'DatePicker',
          'x-validator': [],
          'x-component-props': {
            type: 'daterange',
          },
          'x-decorator-props': {},
          'name': 'createTime',
          'x-designable-id': '8zwqovbinio',
          'x-index': 2,
        },
      },
      'x-index': 0,
    },
  },
  'x-designable-id': 'k9uuet4w6ey',
}

const columns = [
  {
    prop: 'statisticalDate',
    label: '统计日期',
  },
  {
    prop: 'createTime',
    label: '导入日期',
  },
  {
    prop: 't3DriverId',
    label: '司机id',
  },
  {
    prop: 'driverName',
    label: '司机姓名',
  },
  {
    prop: 'managerName',
    label: '司管姓名',
  },
  {
    prop: 'fleetName',
    label: '车队名称',
  },
  {
    prop: 'fleetLeaderName',
    label: '车队队长姓名',
  },
  {
    prop: 'operatorName',
    label: '运营商名称',
  },
  {
    prop: 'acceptedOrderNumber',
    label: '接起订单量',
  },
  {
    prop: 'journeyFlow',
    label: '行程流水(元)',
  },
]

const columnsConfig = {
  statisticalDate: {
    minWidth: 80,
  },
  createTime: {
    minWidth: 80,
  },
}

const queryRef = ref<any>()

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
      :schema="schema"
      url="/vehicle/vehicle/getT3OperationalDataList"
    >
      <QueryProvide v-bind="attrs" ref="queryRef" auto-query="active">
        <QueryTable>
          <template #actions>
            <QueryActionColumn v-slot="{ row }" label="操作" width="100px">
              <ElButton size="small" type="info" @click="$router.push(`/statement/operating/info/${row.operatorId}`)">
                详情
              </ElButton>
            </QueryActionColumn>
          </template>
        </QueryTable>
        <QueryPagination />
      </QueryProvide>
    </UseQuery>
  </div>
</template>
