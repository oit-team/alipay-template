<route lang="yaml">
meta:
  cache: true
</route>

<script setup lang="ts">
const schema = {
  type: 'object',
  properties: {
    '7t2oddolmd3': {
      'type': 'void',
      'x-component': 'FormGrid',
      'x-index': 0,
      'properties': {
        'xt9ff93t76p': {
          'type': 'void',
          'x-component': 'FormGrid.GridColumn',
          'x-index': 0,
          'properties': {
            t3DriverId: {
              'type': 'string',
              'title': '司机id',
              'x-decorator': 'FormItem',
              'x-component': 'Input',
              'x-index': 0,
            },
          },
        },
        '8yncuhbvicl': {
          'type': 'void',
          'x-component': 'FormGrid.GridColumn',
          'x-index': 1,
          'properties': {
            statisticalDate: {
              'type': 'string[]',
              'title': '统计日期',
              'x-decorator': 'FormItem',
              'x-component': 'DatePicker',
              'x-component-props': {
                type: 'daterange',
              },
              'x-index': 0,
            },
          },
        },
        '8yncusdfcicl': {
          'type': 'void',
          'x-component': 'FormGrid.GridColumn',
          'x-index': 2,
          'properties': {
            createTime: {
              'type': 'string[]',
              'title': '入库日期',
              'x-decorator': 'FormItem',
              'x-component': 'DatePicker',
              'x-component-props': {
                type: 'daterange',
              },
              'x-index': 0,
            },
          },
        },
      },
    },
  },
}

const columns = [
  {
    prop: 'statisticalDate',
    label: '统计日期',
  },
  {
    prop: 'createTime',
    label: '入库日期',
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
</script>

<template>
  <div class="h-full p-3">
    <UseQuery v-slot="attrs" url="/vehicle/vehicle/getT3OperationalDataList">
      <QueryProvide v-bind="attrs" ref="query" auto-query="active" :columns="columns" :schema="schema">
        <QueryForm />
        <!-- <QueryToolbar>
          <ElButton type="primary">
            新增
          </ElButton>
        </QueryToolbar> -->
        <QueryTable>
          <template #actions>
            <QueryActionColumn v-slot="{ row }" label="操作" width="100px">
              <ElButton size="small" type="info" @click="$router.push(`./statement/info/${row.operatorId}`)">
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
