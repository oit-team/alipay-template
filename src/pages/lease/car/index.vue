<route lang="yaml">
meta:
  cache: true
</route>

<script setup lang="ts">
import AssignDrawer from './components/AssignDrawer.vue'
import type { TableInstance } from 'element-plus'
import { useUserStore } from '@/store/user'
import { getCityList, useSelectAsyncDataSource, vehicleServiceList } from '@/reactions'
import { importNotice } from '@/utils/importNotice'
const { checkPermission } = usePermission()

const { t } = useI18n()

const queryRef = ref()
const tableRef = ref<TableInstance>()

async function onDelete(row: any) {
  await ElMessageBox.confirm('要删除该车辆吗?', '提示', {
    type: 'warning',
  })
  await axios.post('/vehicle/vehicle/deleteVehicle', { vehicleId: row.vehicleId })
  await queryRef.value?.query()
  ElMessage.success(t('handle.success'))
}

const columnsConfig = {
  orgName: {
    width: 200,
  },
  licensePlateNumber: {
    width: 150,
  },
  vehicleModel: {
    width: 200,
  },
  vehicleFrameNumber: {
    width: 200,
  },
  bodyColor: {
    minWidth: 100,
  },
  vehicleService: {
    width: 200,
  },
  city: {
    minWidth: 100,
  },
  vehicleState: {
    minWidth: 100,
  },
  createTime: {
    width: 200,
  },
  updateTime: {
    width: 200,
  },
}

const { files, open, reset } = useFileDialog()

const importType = ref(0)
function importCar() {
  open({ multiple: false })
  importType.value = 1
}
function importWei() {
  open({ multiple: false })
  importType.value = 2
}

watch(files, async (value) => {
  if (!value || !value.length)
    return

  const { profile } = useUserStore()

  const importUrl: Record<number, string> = {
    1: '/vehicle/vehicle/addImportReplenishVehicle',
    2: '/vehicle/vehicle/addImportIllegal',
  }
  const url = importUrl[importType.value]

  try {
    const { data } = await axios.post(url, {
      file: value[0],
      userId: profile?.userId,
    }, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    })

    importNotice(data.importIndex)
  }
  catch (error) {
    ElMessageBox.alert((error as any).message, '警告', {
      type: 'warning',
    })
  }

  reset()
})

const vehicleIds = ref<number[]>()
const assignDrawerRef = ref<InstanceType<typeof AssignDrawer>>()

function handleSelectionListChange(val: any[]) {
  vehicleIds.value = val.map(item => item.vehicleId)
}

async function openAssignMan() {
  if (vehicleIds.value && vehicleIds.value.length > 0) {
    await nextTick()

    assignDrawerRef.value?.open(vehicleIds, 1)
  }
  else { ElMessage.warning('请先选择要批量分配的车辆') }
}

async function updateTableList() {
  await queryRef.value?.query()
}

async function deleteItems() {
  if (!vehicleIds.value?.length) {
    ElMessage.warning(t('check.leastOne'))
    return
  }
  await ElMessageBox.confirm(t('confirm.delete'), t('tip.warning'), {
    type: 'warning',
  })

  await axios.post('/vehicle/vehicle/deleteVehicle', { vehicleIds: vehicleIds.value })
  await queryRef.value?.query()
  ElMessage.success(t('handle.success'))
}
</script>

<template>
  <div class="h-full p-2">
    <UseQuery
      v-slot="attrs"
      :columns-config="columnsConfig"
      columns-key="1681098926058"
      :key-map="{ data: 'vehicleList', total: 'count' }"
      schema-key="1681098954972"
      url="/vehicle/vehicle/getVehicleList"
    >
      <QueryProvide
        v-bind="attrs"
        ref="queryRef"
        auto-query="active"
      >
        <QueryForm :scope="{ useSelectAsyncDataSource, getCityList, vehicleServiceList }" />
        <QueryToolbar>
          <TButton icon="add" @click="$router.push(`./car/new`)">
            {{ $t('button.new') }}
          </TButton>
          <TButton icon="i-delete" @click="deleteItems()">
            {{ $t('button.delete') }}
          </TButton>
          <TButton icon="import" @click="importCar">
            车辆{{ $t('button.import') }}
          </TButton>
          <TButton icon="import" @click="importWei">
            违章{{ $t('button.import') }}
          </TButton>
          <TButton :disabled="!checkPermission('assignResponsible')" icon="assign" @click="openAssignMan()">
            {{ $t('button.assign') }}负责人
          </TButton>
        </QueryToolbar>
        <QueryTable ref="tableRef" :selection="{ type: 'checkbox' }" @selection-change="handleSelectionListChange">
          <!-- 0 待租 1 已租 -->
          <template #content:vehicleState="{ row }">
            <div :class="row.vehicleStateVal === 1 ? 'text-green' : ''">
              {{ row.vehicleState }}
            </div>
          </template>
          <template #actions>
            <QueryActionColumn v-slot="{ row }" fixed="right" label="操作" width="180px">
              <ElButton
                size="small"
                type="info"
                @click=" $router.push({
                  path: `./car/info/${row.vehicleId}`,
                  query: { carNumber: row.licensePlateNumber },
                })"
              >
                {{ $t('button.info') }}
              </ElButton>
              <ElButton size="small" type="primary" @click="$router.push(`./car/${row.vehicleId}`)">
                {{ $t('button.edit') }}
              </ElButton>
              <ElButton :disabled="row.vehicleStateVal === 1" size="small" type="danger" @click="onDelete(row)">
                {{ $t('button.delete') }}
              </ElButton>
            </QueryActionColumn>
          </template>
        </QueryTable>
        <QueryPagination />
      </QueryProvide>
    </UseQuery>
    <AssignDrawer ref="assignDrawerRef" @done="updateTableList()" />
  </div>
</template>
