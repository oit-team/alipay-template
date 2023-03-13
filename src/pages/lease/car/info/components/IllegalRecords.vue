<route lang="yaml">
meta:
  cache: true
  </route>

<script setup lang="ts">
import { mergeColumns } from '@/utils/helper'

// const { t } = useI18n()
// const route = useRoute()

const schema = {
  'type': 'object',
  'properties': {
    '7t2oddolmd3': {
      'type': 'void',
      'x-component': 'FormGrid',
      'x-component-props': {
        maxColumns: 4,
      },
      'x-index': 0,
      'name': '7t2oddolmd3',
      'x-designable-id': 'o10vjgitznn',
      'x-validator': [],
      'properties': {
        '94exvsf2iwc': {
          'type': 'void',
          'x-component': 'FormGrid.GridColumn',
          'x-index': 0,
          'name': '94exvsf2iwc',
          'x-designable-id': '8inllwr8cbm',
          'properties': {
            projectName: {
              'type': 'string',
              'title': '项目',
              'x-decorator': 'FormItem',
              'x-component': 'Input',
              'x-index': 0,
              'name': 'projectName',
              'x-designable-id': '2pw6cecxu6m',
              'x-validator': [],
              'x-component-props': {},
              'x-decorator-props': {},
            },
          },
        },
        'xt9ff93t76p': {
          'type': 'void',
          'x-component': 'FormGrid.GridColumn',
          'x-index': 1,
          'name': 'xt9ff93t76p',
          'x-designable-id': 'tl8cq2nsffu',
          'x-validator': [],
          'x-component-props': {},
          'properties': {
            companyName: {
              'type': 'string',
              'title': 'DP',
              'x-decorator': 'FormItem',
              'x-component': 'Input',
              'x-index': 0,
              'name': 'companyName',
              'x-designable-id': '74gobfplunh',
              'x-validator': [],
              'x-component-props': {},
              'x-decorator-props': {},
            },
          },
        },
        '8yncuhbvics': {
          'type': 'void',
          'x-component': 'FormGrid.GridColumn',
          'x-index': 2,
          'name': '8yncuhbvics',
          'x-designable-id': 'j93a0surh8q',
          'x-validator': [],
          'x-component-props': {},
          'properties': {
            plateNumber: {
              'type': 'string[]',
              'title': '车牌号',
              'x-decorator': 'FormItem',
              'x-component': 'Input',
              'x-index': 0,
              'name': 'violationAddress',
              'x-designable-id': 's5qihkpge74',
              'x-validator': [],
              'x-component-props': {},
              'x-decorator-props': {},
            },
          },
        },
        '8yncuhbvicc': {
          'type': 'void',
          'x-component': 'FormGrid.GridColumn',
          'x-index': 3,
          'name': '8yncuhbvicc',
          'x-designable-id': 'f7c1np8k6e8',
          'properties': {
            disposeState: {
              'type': 'string[]',
              'title': '处理状态',
              'x-decorator': 'FormItem',
              'x-component': 'Input',
              'x-index': 0,
              'name': 'disposeState',
              'x-designable-id': '0pb2akfqj9c',
              'x-validator': [],
              'x-component-props': {},
              'x-decorator-props': {},
            },
          },
        },
        'sndbkxxrxeb': {
          'type': 'void',
          'x-component': 'FormGrid.GridColumn',
          'x-validator': [],
          'x-component-props': {},
          'x-designable-id': 'sndbkxxrxeb',
          'properties': {
            disposeTime: {
              'type': 'string',
              'title': '处理时间',
              'x-decorator': 'FormItem',
              'x-component': 'DatePicker',
              'x-validator': [],
              'x-component-props': {},
              'x-decorator-props': {},
              'name': 'disposeTime',
              'x-designable-id': 'kszdc6dv4vt',
              'x-index': 0,
            },
          },
          'x-index': 4,
        },
      },
    },
  },
  'x-designable-id': '609ucp7429v',
}

const _columns = [
  {
    prop: 'driverName',
    label: '项目',
  },
  {
    prop: 'identityCard',
    label: 'DP',
    span: 2,
  },
  {
    prop: 'driverPhone',
    label: '车牌',
  },
  {
    prop: 'sex',
    label: '违法时间',
  },
  {
    prop: 'age',
    label: '违法地点',
  },
  {
    prop: 'licensePlateNumber',
    label: '违法行为',
    span: 2,
  },
  {
    prop: 'vehicleModel',
    label: '违法记录号',
  },
  {
    prop: 'vehicleStatue',
    label: '违法行为代码',
  },
  {
    prop: 'city',
    label: '违法记分',
  },
  {
    prop: 'exclusiveService',
    label: '罚款金额',
  },
  {
    prop: 'driverOperate',
    label: '采集机关',
  },
  {
    prop: 'driverFleet',
    label: '处理状态',
  },
  {
    prop: 'createTime',
    label: '处理时间',
  },
  {
    prop: 'createTime',
    label: '查询时间',
  },
]

const queryRef = ref()

const columns = mergeColumns(_columns, {
  importTime: {
    width: 120,
  },
  queryTime: {
    width: 120,
  },
  violationTime: {
    width: 120,
  },
  companyName: {
    width: 200,
    showOverflowTooltip: true,
  },
  violationAddress: {
    width: 150,
    showOverflowTooltip: true,
  },
  plateNumber: {
    width: 200,
    showOverflowTooltip: true,
  },
  codeOfViolation: {
    width: 150,
    showOverflowTooltip: true,
  },
})

// useAxios('/vehicle/vehicle/getViolationInfo', {
//   method: 'POST',
//   data: { vehicleId: route.params.id },
// })
</script>

<template>
  <div class="h-full p-2">
    <UseQuery
      v-slot="attrs"
      url="/vehicle/vehicle/getViolationInfo"
      :key-map="{ total: 'totalCount' }"
      :data="{
        vehicleId: $route.params.id,
      }"
    >
      <QueryProvide
        v-bind="attrs"
        ref="queryRef"
        auto-query="active"
        :schema="schema"
        :columns="columns"
      >
        <QueryForm />
        <QueryTable />
        <QueryPagination />
      </QueryProvide>
    </UseQuery>
  </div>
</template>
