<route lang="yaml">
meta:
  cache: true
</route>

<script setup lang="ts">
import { useUserStore } from '@/store/user'

const { t } = useI18n()

const { files, open } = useFileDialog()

const queryRef = ref()

onMounted(() => {
  queryRef.value?.query()
})

const statementLoading = ref(false)
watch(files, async (value) => {
  if (!value || !value.length)
    return

  const { profile } = useUserStore()

  statementLoading.value = true
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
    }).finally(() => {
      statementLoading.value = false
    })
})

const columnsConfig = {
  statisticalDate: {
    width: 150,
  },
  createTime: {
    width: 180,
  },
  t3DriverId: {
    width: 150,
  },
  driverName: {
    minWidth: 100,
  },
  carNumber: {
    minWidth: 150,
  },
  managerName: {
    minWidth: 100,
  },
  fleetName: {
    minWidth: 150,
  },
  fleetLeaderName: {
    minWidth: 150,
  },
  operatorName: {
    minWidth: 150,
  },
  acceptedOrderNumber: {
    minWidth: 100,
  },
  journeyFlow: {
    minWidth: 120,
  },
}
</script>

<template>
  <div class="h-full p-3">
    <UseQuery
      v-slot="attrs"
      :columns-config="columnsConfig"
      columns-key="1681099099071"
      schema-key="1681099156518"
      url="/vehicle/vehicle/getT3OperationalDataList"
    >
      <QueryProvide
        v-bind="attrs"
        ref="queryRef"
        auto-query="active"
      >
        <QueryForm />
        <QueryToolbar>
          <TButton icon="import" @click="open({ multiple: false })">
            {{ $t('button.import') }}运营流水
          </TButton>
        </QueryToolbar>
        <QueryTable v-loading="statementLoading" element-loading-text="数据正在导入...">
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
