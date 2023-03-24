<route lang="yaml">
meta:
  cache: true
</route>

<script setup lang="ts">
import { useUserStore } from '@/store/user'

const { t } = useI18n()

const { files, open } = useFileDialog()

watch(files, async (value) => {
  if (!value || !value.length)
    return

  const { profile } = useUserStore()

  axios.post('/vehicle/vehicle/addT3OperationalData', {
    file: value[0],
    userId: profile?.userId,
  }, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  })
    .then(() => {
      ElMessage.success(t('import.success'))
    })
    .catch((err) => {
      ElMessageBox.alert(err.message, '警告', {
        type: 'warning',
      })
    })
})
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
        <QueryToolbar>
          <ElButton type="info" @click="open({ multiple: false })">
            {{ $t('button.import') }}运营流水
          </ElButton>
        </QueryToolbar>
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
