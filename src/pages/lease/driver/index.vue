<route lang="yaml">
meta:
  cache: true
</route>

<script setup lang="ts">
import AssignDrawer from '../car/components/AssignDrawer.vue'
import { useUserStore } from '@/store/user'
import { numberMasking } from '@/utils/helper'

const { t } = useI18n()
const { checkPermission } = usePermission()

const columnConfig = {
  driverName: {
    minWidth: 100,
  },
  createTime: {
    width: 120,
  },
  driverOperate: {
    width: 200,
  },
  driverPhone: {
    width: 150,
  },
  identityCard: {
    width: 200,
  },
  driverFleet: {
    width: 150,
  },
  vehicleModel: {
    width: 200,
  },
  licensePlateNumber: {
    width: 150,
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

const { files, open, reset } = useFileDialog()

const driverLoading = ref(false)
watch(files, async (value) => {
  if (!value || !value.length)
    return

  const { profile } = useUserStore()

  driverLoading.value = true
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
    }).finally(() => {
      driverLoading.value = false
    })

  reset()
})

const checkedUserArr = ref<any[]>()
const checkUserIds = ref<any[]>() // 选中的用户ids
const assignDrawerRef = ref<InstanceType<typeof AssignDrawer>>()

function handleSelectionListChange(val: any) {
  checkedUserArr.value = val
}

async function openAssignMan() {
  if (checkedUserArr.value && checkedUserArr.value.length > 0) {
    await nextTick()
    const ids = checkedUserArr.value.map(item => item.driverId)
    checkUserIds.value = ids
    assignDrawerRef.value?.open(checkUserIds, 0)
  }
  else { ElMessage.warning('请先选择要批量分配的司机') }
}

async function updateTableList() {
  await queryRef.value?.query()
}
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
          <TButton icon="add" @click="$router.push('./driver/new')">
            {{ $t('button.new') }}
          </TButton>
          <TButton icon="import" @click="open({ multiple: false })">
            {{ $t('button.import') }}
          </TButton>
          <TButton icon="apply" @click="$router.push('/process/car-rental')">
            {{ $t('button.apply') }}租车
          </TButton>
          <TButton icon="apply" @click="$router.push('/process/car-rental-return')">
            {{ $t('button.apply') }}退车
          </TButton>
          <TButton :disabled="checkPermission('assignResponsible') ? false : true" icon="assign" @click="openAssignMan()">
            {{ $t('button.assign') }}负责人
          </TButton>
        </QueryToolbar>
        <QueryTable v-loading="driverLoading" element-loading-text="数据正在导入..." :selection="{ type: 'checkbox' }" @selection-change="handleSelectionListChange">
          <!-- 手机号数据加密 -->
          <template #content:driverPhone="{ value }">
            {{ checkPermission('selectEncryption') ? numberMasking(value, { start: 3, end: -4 }) : value }}
          </template>
          <template #content:licensePlateNumber="{ row, value }">
            <ElLink
              @click=" $router.push({
                path: `./car/info/${row.vehicleId}`,
                query: { carNumber: value },
              }) "
            >
              {{ value }}
            </ElLink>
          </template>
          <template #content:statue="{ value }">
            <span :class="value === '签约' ? 'text-[#63c441]' : ''">
              {{ value }}
            </span>
          </template>
          <template #actions>
            <QueryActionColumn v-slot="{ row }" fixed="right" width="180px">
              <ElButton type="info" @click="$router.push(`./driver/info/${row.driverId}`)">
                {{ $t('button.info') }}
              </ElButton>
              <ElButton type="primary" @click="$router.push(`./driver/${row.driverId}`)">
                {{ $t('button.edit') }}
              </ElButton>
              <ElButton :disabled="row.statueKey === 1" type="danger" @click="onDelete(row)">
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
