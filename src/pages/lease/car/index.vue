<route lang="yaml">
meta:
  cache: true
</route>

<script setup lang="ts">
import { useUserStore } from '@/store/user'

const { t } = useI18n()

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
            licensePlateNumber: {
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
            vehicleFrameNumber: {
              'title': '车架号',
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
            vehicleBrand: {
              'type': 'string',
              'title': '车辆品牌',
              'x-decorator': 'FormItem',
              'x-component': 'Input',
              'x-index': 0,
            },
          },
        },
        '8yncuhbvicl': {
          'type': 'void',
          'x-component': 'FormGrid.GridColumn',
          'x-index': 3,
          'properties': {
            createTime: {
              'type': 'string[]',
              'title': '创建时间',
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

const queryRef = ref()

async function onDelete(row: any) {
  await ElMessageBox.confirm('要删除该车辆吗?', '提示', {
    type: 'warning',
  })
  await axios.post('/vehicle/vehicle/deleteVehicle', { vehicleId: row.vehicleId })
  await queryRef.value?.query()
  ElMessage.success(t('handle.success'))
}

const columns = [
  {
    prop: 'licensePlateNumber',
    label: '车牌号',
  },
  {
    prop: 'vehicleFrameNumber',
    label: '车架号',
  },
  {
    prop: 'vehicleBrand',
    label: '车辆品牌',
  },
  {
    prop: 'bodyColor',
    label: '车身颜色',
  },
  {
    prop: 'stateMsg',
    label: '状态值',
  },
  {
    prop: 'vehicleState',
    label: '车辆状态',
  },
  {
    prop: 'createTime',
    label: '创建时间',
  },
  {
    prop: 'updateTime',
    label: '更新时间',
  },
]
const columnsConfig = {
  licensePlateNumber: {
    width: 150,
    showOverflowTooltip: true,
  },
  vehicleBrand: {
    width: 200,
    showOverflowTooltip: true,
  },
  vehicleFrameNumber: {
    width: 200,
    showOverflowTooltip: true,
  },
  bodyColor: {
    width: 100,
    showOverflowTooltip: true,
  },
  createTime: {
    width: 200,
    showOverflowTooltip: true,
  },
  updateTime: {
    width: 200,
    showOverflowTooltip: true,
  },
}

const { files, open } = useFileDialog()

const importType = ref(0)

function importYun() {
  open({ multiple: false })
  importType.value = 0
}
function importCar() {
  open({ multiple: false })
  importType.value = 1
}
function importWei() {
  open({ multiple: false })
  importType.value = 2
}
const url = ref('')
watch(files, async (value) => {
  if (!value || !value.length)
    return

  const { profile } = useUserStore()

  switch (importType.value) {
    case 0:
      url.value = '/vehicle/vehicle/addT3OperationalData'
      break
    case 1:
      url.value = '/vehicle/vehicle/addImportT3ReplenishVehicle'
      break
    case 2:
      url.value = '/vehicle/vehicle/addImportIllegal'
      break
    default:
      url.value = ''
      break
  }

  axios.post(url.value, {
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
    <UseQuery
      v-slot="attrs"
      :columns="columns"
      :columns-config="columnsConfig"
      :key-map="{ data: 'vehicleList', total: 'count' }"
      :schema="schema"
      url="/vehicle/vehicle/getVehicleList"
    >
      <QueryProvide
        v-bind="attrs"
        ref="queryRef"
        auto-query="active"
      >
        <QueryForm />
        <QueryToolbar>
          <ElButton type="primary" @click="$router.push(`./car/new`)">
            {{ $t('button.new') }}
          </ElButton>
          <ElButton type="info" @click="importYun">
            {{ $t('button.import') }}运营流水
          </ElButton>
          <ElButton type="info" @click="importCar">
            {{ $t('button.import') }}车辆信息
          </ElButton>
          <ElButton type="info" @click="importWei">
            {{ $t('button.import') }}违章信息
          </ElButton>
        </QueryToolbar>
        <QueryTable>
          <template #actions>
            <QueryActionColumn v-slot="{ row }" fixed="right" label="操作" width="180px">
              <ElButton size="small" type="info" @click="$router.push(`./car/info/${row.vehicleId}`)">
                {{ $t('button.info') }}
              </ElButton>
              <ElButton size="small" type="primary" @click="$router.push(`./car/${row.vehicleId}`)">
                {{ $t('button.edit') }}
              </ElButton>
              <ElButton size="small" type="danger" @click="onDelete(row)">
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
