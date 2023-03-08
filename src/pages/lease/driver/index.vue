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
      'x-component-props': {
        maxColumns: 4,
      },
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
              'title': '名称',
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
            '[startCreateTime,endCreateTime]': {
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
        '8yncuhbvics': {
          'type': 'void',
          'x-component': 'FormGrid.GridColumn',
          'x-index': 4,
          'properties': {
            driverPhone: {
              'type': 'string[]',
              'title': '联系电话',
              'x-decorator': 'FormItem',
              'x-component': 'Input',
              'x-index': 0,
            },
          },
        },
        '8yncuhbvicc': {
          'type': 'void',
          'x-component': 'FormGrid.GridColumn',
          'x-index': 4,
          'properties': {
            identityCard: {
              'type': 'string[]',
              'title': '身份证号',
              'x-decorator': 'FormItem',
              'x-component': 'Input',
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
    prop: 'driverName',
    label: '名称',
  },
  {
    prop: 'identityCard',
    label: '身份证号',
    width: 200,
    showOverflowTooltip: true,
  },
  {
    prop: 'driverPhone',
    label: '联系电话',
    width: 150,
    showOverflowTooltip: true,
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
    prop: 'licensePlateNumber',
    label: '车牌号',
  },
  {
    prop: 'vehicleModel',
    label: '车型',
  },
  {
    prop: 'vehicleStatue',
    label: '车辆状态',
  },
  {
    prop: 'city',
    label: '城市',
  },
  {
    prop: 'exclusiveService',
    label: '专属私服',
  },
  {
    prop: 'driverOperate',
    label: '所属运营商',
    width: 200,
    showOverflowTooltip: true,
  },
  {
    prop: 'driverFleet',
    label: '所属车队',
  },
  {
    prop: 'createTime',
    label: '创建时间',
    width: 120,
  },
]

const queryRef = ref()

async function onDelete(row: any) {
  await ElMessageBox.confirm('要删除该司机吗?', '提示', {
    type: 'warning',
  })
  await axios.post('/driverServer/driver/deleteDriverInfo', { driverId: row.driverId })
  await queryRef.value?.query()
  ElMessage.success('操作成功')
}
</script>

<template>
  <div class="h-full p-2">
    <UseQuery v-slot="attrs" url="/driverServer/driver/getDriverList">
      <QueryProvide v-bind="attrs" ref="queryRef" auto-query="active" :columns="columns" :schema="schema">
        <QueryForm />
        <QueryToolbar>
          <ElButton type="primary" @click="$router.push('./driver/new')">
            新增
          </ElButton>
        </QueryToolbar>
        <QueryTable>
          <template #actions>
            <QueryActionColumn v-slot="{ row }" label="操作" width="180px" fixed="right">
              <ElButton type="info" @click="$router.push(`./driver/info/${row.driverId}`)">
                详情
              </ElButton>
              <ElButton type="primary" @click="$router.push(`./driver/${row.driverId}`)">
                编辑
              </ElButton>
              <ElButton type="danger" @click="onDelete(row)">
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
