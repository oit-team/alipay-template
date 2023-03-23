<route>
meta:
  cache: true
</route>

<script setup lang="ts">
const router = useRouter()

const schema = {
  'type': 'object',
  'properties': {
    '7t2oddolmd3': {
      'type': 'void',
      'x-component': 'FormGrid',
      'x-index': 0,
      'name': '7t2oddolmd3',
      'x-designable-id': 'zmtlz5wbmr9',
      'properties': {
        '94exvsf2iwc': {
          'type': 'void',
          'x-component': 'FormGrid.GridColumn',
          'x-index': 0,
          'name': '94exvsf2iwc',
          'x-designable-id': 'p2zjhwhznxo',
          'properties': {
            licensePlateNumber: {
              'type': 'string',
              'title': '车牌号',
              'x-decorator': 'FormItem',
              'x-component': 'Input',
              'x-index': 0,
              'name': 'licensePlateNumber',
              'x-designable-id': 'g8e4vdsodke',
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
          'x-designable-id': 'gidkb069pec',
          'properties': {
            vehicleFrameNumber: {
              'title': '司机姓名',
              'x-decorator': 'FormItem',
              'x-component': 'Input',
              'x-index': 0,
              'name': 'vehicleFrameNumber',
              'x-designable-id': 'fqqu90lagw0',
              'x-validator': [],
              'x-component-props': {},
              'x-decorator-props': {},
            },
          },
        },
        'xl5ijh663zj': {
          'type': 'void',
          'x-component': 'FormGrid.GridColumn',
          'x-index': 2,
          'name': 'xl5ijh663zj',
          'x-designable-id': 'u8er41u23jg',
          'x-validator': [],
          'x-component-props': {},
          'properties': {
            '[startcreateDate,endcreateDate]': {
              'type': 'string',
              'title': '查询时间',
              'x-decorator': 'FormItem',
              'x-component': 'DatePicker',
              'x-index': 0,
              'name': '[startcreateDate,endcreateDate]',
              'x-designable-id': 'cl06jvkw8p5',
              'x-validator': [],
              'x-component-props': {
                type: 'daterange',
                placeholder: '',
              },
              'x-decorator-props': {},
            },
          },
        },
      },
    },
  },
  'x-designable-id': '7n5w97gbxef',
}

const queryRef = ref()

async function goDetail(row: any) {
  // router.push(`${row.nextTaskPageUrl}?workCode=${row.workCode}&flowCode=${row.flowCode}&taskCode=${row.taskCode}`)
  router.push({
    path: row.taskPageUrl,
    query: {
      workCode: row.workCode,
      flowCode: row.flowCode,
      taskCode: row.taskCode,
      // nextTaskCode: row.nextTaskCode,
      status: row.status,
    },
  })
}

const columns = [
  {
    prop: 'workCode',
    label: '工单编号',
  },
  {
    prop: 'workName',
    label: '工单名称',
  },
  {
    prop: 'flowCode',
    label: '流程编号',
  },
  {
    prop: 'status',
    label: '状态',
  },
  {
    prop: 'driverId',
    label: '司机ID',
  },
  {
    prop: 'driverCode',
    label: '司机编号',
  },
  {
    prop: 'driverName',
    label: '司机姓名',
  },
  {
    prop: 'city',
    label: '所属城市',
  },
]
const columnsConfig = {
  workCode: {
    width: 200,
    showOverflowTooltip: true,
  },
  workName: {
    width: 150,
    showOverflowTooltip: true,
  },
  flowCode: {
    width: 150,
    showOverflowTooltip: true,
  },
  taskCode: {
    width: 150,
    showOverflowTooltip: true,
  },
}
</script>

<template>
  <div class="h-full p-2">
    <UseQuery
      v-slot="attrs"
      :columns="columns"
      :columns-config="columnsConfig"
      :key-map="{ data: 'resultList', total: 'count' }"
      :schema="schema"
      url="/workFlow/workFlow/workOrderList"
    >
      <QueryProvide
        v-bind="attrs"
        ref="queryRef"
        auto-query="active"
      >
        <QueryForm />
        <QueryToolbar />
        <QueryTable>
          <template #actions>
            <QueryActionColumn v-slot="{ row }" fixed="right" label="操作" width="80px">
              <ElButton size="small" type="success" @click="goDetail(row)">
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
