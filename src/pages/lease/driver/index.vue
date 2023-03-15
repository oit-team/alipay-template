<route lang="yaml">
meta:
  cache: true
</route>

<script setup lang="ts">
import { useUserStore } from '@/store/user'

const { t } = useI18n()

const columnConfig = {
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
}

const queryRef = ref()

async function onDelete(row: any) {
  await ElMessageBox.confirm(t('confirm.delete'), t('tip.info'), {
    type: 'warning',
  })
  await axios.post('/driverServer/driver/deleteDriverInfo', { driverId: row.driverId })
  await queryRef.value?.query()
  ElMessage.success(t('handle.success'))
}

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
    <UseQuery
      v-slot="attrs"
      :columns-config="columnConfig"
      columns-key="1678439396062"
      schema-key="1678439739103"
      url="/driverServer/driver/getDriverList"
    >
      <QueryProvide
        v-bind="attrs"
        ref="queryRef"
        auto-query="active"
      >
        <QueryForm />
        <QueryToolbar>
          <ElButton type="primary" @click="$router.push('./driver/new')">
            {{ $t('button.new') }}
          </ElButton>
          <ElButton type="info" @click="open({ multiple: false })">
            {{ $t('button.import') }}
          </ElButton>
          <ElButton :auto-insert-space="false" type="info" @click="$router.push('/process/car-rental')">
            {{ $t('button.apply') }}租车
          </ElButton>
          <ElButton :auto-insert-space="false" type="info" @click="$router.push('/process/car-rental-return')">
            {{ $t('button.apply') }}退车
          </ElButton>
        </QueryToolbar>
        <QueryTable>
          <template #actions>
            <QueryActionColumn v-slot="{ row }" fixed="right" width="180px">
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
