<route lang="yaml">
meta:
  cache: true
</route>

<script setup lang="ts">
import { useUserStore } from '@/store/user'
import { getCityList, useSelectAsyncDataSource, vehicleServiceList } from '@/reactions'

const { t } = useI18n()

const queryRef = ref()

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

const carLoading = ref(false)

watch(files, async (value) => {
  if (!value || !value.length)
    return

  const { profile } = useUserStore()

  const importUrl: Record<number, string> = {
    1: '/vehicle/vehicle/addImportReplenishVehicle',
    2: '/vehicle/vehicle/addImportIllegal',
  }
  const url = importUrl[importType.value]

  carLoading.value = true

  axios.post(url, {
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
    }).finally(() => {
      carLoading.value = false
    })

  reset()
})
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
          <TButton icon="import" @click="importCar">
            车辆{{ $t('button.import') }}
          </TButton>
          <TButton icon="import" @click="importWei">
            违章{{ $t('button.import') }}
          </TButton>
        </QueryToolbar>
        <QueryTable v-loading="carLoading" element-loading-text="数据正在导入...">
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
  </div>
</template>
