<route lang="yaml">
meta:
  cache: true
</route>

<script setup lang="ts">
import dayjs from 'dayjs'
import { ElDatePicker } from 'element-plus'
import { useUserStore } from '@/store/user'
import { importNotice } from '@/utils/importNotice'

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

const { t } = useI18n()
const { checkPermission } = usePermission()
const queryRef = ref()

onMounted(() => {
  queryRef.value?.query()
})

const { files, open } = useFileDialog()
watch(files, async (value) => {
  if (!value || !value.length)
    return

  const { profile } = useUserStore()

  try {
    const { data } = await axios.post('/vehicle/vehicle/addT3OperationalData', {
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
})

async function addDataBulletinBoard() {
  const targetDate = ref()
  await ElMessageBox({
    title: '选择日期',
    message: () => h(ElDatePicker, {
      'style': { width: '100%' },
      'placeholder': '请选择日期',
      // 往前一个月
      'disabled-date': (time: any) => !dayjs(time).isBetween(dayjs().subtract(1, 'month'), dayjs(), 'day', '[]'),
      'modelValue': targetDate.value,
      'onUpdate:modelValue': (value: any) => {
        targetDate.value = value
      },
    }),
  })

  await axios.post('/vehicle/reportForm/addDataBulletinBoard', {
    time: dayjs(targetDate.value).format('YYYY-MM-DD'),
  })
  ElMessage.success(t('handle.success'))
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
          <TButton :disabled="checkPermission('dataOperation')" @click="addDataBulletinBoard()">
            流水计算
          </TButton>
        </QueryToolbar>
        <QueryTable>
          <template #actions>
            <QueryActionColumn v-slot="{ row }" label="操作" width="100px">
              <ElButton size="small" type="info" @click="$router.push(`./operating/info/${row.operatorId}`)">
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
