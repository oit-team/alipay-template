<route>
  meta:
    cache: true
</route>

<script setup lang="ts">
import { downloadFile } from '@oit/utils'
import querySchema from './schema/query.json'
import { importNotice } from '@/utils/importNotice'

const columns = [
  { prop: 'licensePlateNumber', label: '车牌' },
  { prop: 'driverNo', label: '司机ID' },
  { prop: 'driverName', label: '司机名称' },
  { prop: 'leaseTerm', label: '租期' },
  { prop: 'rent', label: '租金' },
  { prop: 'bindingDate', label: '绑车' },
  { prop: 'startDate', label: '起租日期' },
  { prop: 'endDate', label: '到期日期' },
  { prop: 'returnDate', label: '退车日期' },
  { prop: 'numberOfDays', label: '天数' },
  { prop: 'dailyRent', label: '日租金' },
  { prop: 'rentReceivable', label: '应收租金' },
  { prop: 't3Withholding', label: 'T3代扣' },
]

const queryData = ref()

async function downloadExport() {
  const { data } = await axios.post(
    '/statement/rentOutStatistics/exportRentOutStatisticsList',
    queryData.value,
    { responseType: 'blob' },
  )
  downloadFile(data, '退租统计.xls')
}

const { open, reset, onChange } = useFileDialog()

onChange(async (files) => {
  if (!files?.length)
    return

  try {
    const { profile } = useUserStore()
    const { data } = await axios.post('/order/leaseOrder/importWithholdingRecords', {
      file: files[0],
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
</script>

<template>
  <div class="h-full p-3">
    <UseQuery
      v-slot="attrs"
      :columns="columns"
      :columns-config="{}"
      :schema="querySchema"
      url="/statement/rentOutStatistics/getRentOutStatisticsList"
      @query="queryData = $event"
    >
      <QueryProvide
        v-bind="attrs"
        ref="queryRef"
        auto-query="active"
      >
        <QueryForm />
        <QueryToolbar>
          <TButton icon="i-export" @click="downloadExport()">
            导出
          </TButton>
          <TButton icon="i-import" @click="open()">
            导入T3代扣信息
          </TButton>
        </QueryToolbar>
        <QueryTable />
        <QueryPagination />
      </QueryProvide>
    </UseQuery>
  </div>
</template>
