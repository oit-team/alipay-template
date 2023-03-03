<route lang="yaml">
meta:
  cache: true
</route>

<script setup lang="ts">
const schema = {
  'type': 'object',
  'properties': {
    '7t2oddolmd3': {
      'type': 'void',
      'x-component': 'FormGrid',
      'x-validator': [],
      'x-component-props': {},
      'x-designable-id': '7t2oddolmd3',
      'x-index': 0,
      'properties': {
        '94exvsf2iwc': {
          'type': 'void',
          'x-component': 'FormGrid.GridColumn',
          'x-designable-id': '94exvsf2iwc',
          'x-index': 0,
          'properties': {
            ps6ktb7d17e: {
              'type': 'string',
              'title': '车牌号',
              'x-decorator': 'FormItem',
              'x-component': 'Input',
              'x-validator': [],
              'x-component-props': {},
              'x-decorator-props': {},
              'x-designable-id': 'ps6ktb7d17e',
              'x-index': 0,
            },
          },
        },
        'xt9ff93t76p': {
          'type': 'void',
          'x-component': 'FormGrid.GridColumn',
          'x-designable-id': 'xt9ff93t76p',
          'x-index': 1,
          'properties': {
            driverName: {
              'type': 'string',
              'title': '司机',
              'x-decorator': 'FormItem',
              'x-component': 'Input',
              'x-validator': [],
              'x-component-props': {},
              'x-decorator-props': {},
              'x-designable-id': 'ym35mpsnntv',
              'x-index': 0,
            },
          },
        },
        'xl5ijh663zj': {
          'type': 'void',
          'x-component': 'FormGrid.GridColumn',
          'x-validator': [],
          'x-component-props': {},
          'x-designable-id': 'xl5ijh663zj',
          'x-index': 2,
          'properties': {
            sm1z64noil3: {
              'title': '车辆状态',
              'x-decorator': 'FormItem',
              'x-component': 'Select',
              'x-validator': [],
              'x-component-props': {},
              'x-decorator-props': {},
              'enum': [],
              'x-designable-id': 'sm1z64noil3',
              'x-index': 0,
            },
          },
        },
        '8yncuhbvicl': {
          'type': 'void',
          'x-component': 'FormGrid.GridColumn',
          'x-designable-id': '8yncuhbvicl',
          'x-index': 3,
          'properties': {
            createTime: {
              'type': 'string[]',
              'title': '入库时间',
              'x-decorator': 'FormItem',
              'x-component': 'DatePicker',
              'x-validator': [],
              'x-component-props': {
                type: 'daterange',
              },
              'x-decorator-props': {},
              'x-designable-id': 'czi66i1c9gu',
              'x-index': 0,
            },
          },
        },
      },
    },
  },
  'x-designable-id': 'kz22atjmtgk',
}

const columns = [
  {
    prop: 'deiverCode',
    label: '编号',
  },
  {
    prop: 'driverName',
    label: '名称',
  },
  {
    prop: 'sex',
    label: '性别',
  },
  {
    prop: 'age',
    label: '年龄',
  },
  {
    prop: '',
    label: '已有车辆',
  },
  {
    prop: '',
    label: '车型',
  },
  {
    prop: '',
    label: '车辆状态',
  },
  {
    prop: '',
    label: '所属运营商',
  },
  {
    prop: 'createTime',
    label: '入库时间',
  },
  {
    prop: 'orgId',
    label: '所属城市',
  },
]
</script>

<template>
  <div class="h-full">
    <UseQuery
      v-slot="attrs"
      url="/driverServer/driver/getDriverList"
    >
      <QueryProvide
        v-bind="attrs"
        ref="query"
        auto-query="active"
        :columns="columns"
        :schema="schema"
      >
        <QueryForm />
        <QueryToolbar>
          <ElButton type="primary" @click="$router.push('./driver/new')">
            新增
          </ElButton>
        </QueryToolbar>
        <QueryTable>
          <template #actions>
            <QueryActionColumn label="操作" width="200px" fixed="right">
              <ElButton type="info">
                详情
              </ElButton>
              <ElButton type="primary">
                编辑
              </ElButton>
              <ElButton type="danger">
                删除
              </ElButton>
            </QueryActionColumn>
          </template>
        </QueryTable>
        <QueryPagination />
      </QueryProvide>
    </UseQuery>
  </div>
</template>
