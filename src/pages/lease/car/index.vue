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
        '94exvsf2iwc': {
          'type': 'void',
          'x-component': 'FormGrid.GridColumn',
          'x-index': 0,
          'properties': {
            ps6ktb7d17e: {
              'type': 'string',
              'title': '车牌号',
              'x-decorator': 'FormItem',
              'x-component': 'Input',
              'x-index': 0,
            },
          },
        },
        'xt9ff93t76p': {
          'type': 'void',
          'x-component': 'FormGrid.GridColumn',
          'x-index': 1,
          'properties': {
            driverName: {
              'type': 'string',
              'title': '司机',
              'x-decorator': 'FormItem',
              'x-component': 'Input',
              'x-index': 0,
            },
          },
        },
        'xl5ijh663zj': {
          'type': 'void',
          'x-component': 'FormGrid.GridColumn',
          'x-index': 2,
          'properties': {
            sm1z64noil3: {
              'title': '车辆状态',
              'x-decorator': 'FormItem',
              'x-component': 'Select',
              'x-index': 0,
            },
          },
        },
        '8yncuhbvicl': {
          'type': 'void',
          'x-component': 'FormGrid.GridColumn',
          'x-index': 3,
          'properties': {
            czi66i1c9gu: {
              'type': 'string[]',
              'title': '入库时间',
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
  <div class="h-full p-2">
    <UseQuery v-slot="attrs" url="/vehicle/vehicle/getVehicleList">
      <QueryProvide
        v-bind="attrs"
        ref="query"
        auto-query="active"
        :columns="columns"
        :schema="schema"
      >
        <QueryForm />
        <QueryToolbar>
          <ElButton type="primary">
            新增
          </ElButton>
        </QueryToolbar>
        <QueryTable>
          <template #actions>
            <QueryActionColumn v-slot="{ row }" label="操作" width="180px">
              <ElButton type="info" size="small" @click="$router.push(`./info/${row.roleId}`)">
                详情
              </ElButton>
              <ElButton type="primary" size="small">
                编辑
              </ElButton>
              <ElButton type="danger" size="small">
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
