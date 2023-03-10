<route lang="yaml">
meta:
  cache: true
</route>

<script setup lang="ts">
import { useUserStore } from '@/store/user'
import { mergeColumns } from '@/utils/helper'

const { t } = useI18n()

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
            car: {
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
          'x-index': 5,
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

const _columns = [
  {
    prop: 'driverName',
    label: '名称',
  },
  {
    prop: 'identityCard',
    label: '身份证号',
  },
  {
    prop: 'driverPhone',
    label: '联系电话',
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
  },
  {
    prop: 'driverFleet',
    label: '所属车队',
  },
  {
    prop: 'createTime',
    label: '创建时间',
  },
]

const queryRef = ref()

async function onDelete(row: any) {
  await ElMessageBox.confirm(t('confirm.delete'), t('tip.info'), {
    type: 'warning',
  })
  await axios.post('/driverServer/driver/deleteDriverInfo', { driverId: row.driverId })
  await queryRef.value?.query()
  ElMessage.success(t('handle.success'))
}

const columns = mergeColumns(_columns, {
  createTime: {
    width: 120,
  },
  driverOperate: {
    width: 200,
    showOverflowTooltip: true,
  },
  driverPhone: {
    width: 150,
    showOverflowTooltip: true,
  },
  identityCard: {
    width: 200,
    showOverflowTooltip: true,
  },
  driverFleet: {
    width: 150,
    showOverflowTooltip: true,
  },
})

const { files, open } = useFileDialog()

watch(files, async (value) => {
  if (!value || !value.length)
    return

  const { profile } = useUserStore()

  axios.post('/driverServer/excel/addimporDriverInfo', {
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
</script>

<template>
  <div class="h-full p-2">
    <UseQuery v-slot="attrs" url="/driverServer/driver/getDriverList">
      <QueryProvide
        v-bind="attrs"
        ref="queryRef"
        auto-query="active"
        :schema="schema"
        :columns="columns"
      >
        <QueryForm />
        <QueryToolbar>
          <ElButton type="primary" @click="$router.push('./driver/new')">
            {{ $t('button.new') }}
          </ElButton>
          <ElButton type="info" @click="open({ multiple: false })">
            {{ $t('button.import') }}
          </ElButton>
        </QueryToolbar>
        <QueryTable>
          <template #actions>
            <QueryActionColumn v-slot="{ row }" width="180px" fixed="right">
              <ElButton type="info" @click="$router.push(`./driver/info/${row.driverId}`)">
                {{ $t('button.info') }}
              </ElButton>
              <ElButton type="primary" @click="$router.push(`./driver/${row.driverId}`)">
                {{ $t('button.edit') }}
              </ElButton>
              <ElButton type="danger" @click="onDelete(row)">
                {{ $t('button.delete') }}
              </ElButton>
            </QueryActionColumn>
          </template>
        </QueryTable>
        <QueryPagination />
      </QueryProvide>
    </UseQuery>
  </div>
</template>
