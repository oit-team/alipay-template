<route>
meta:
  cache: true
</route>

<script setup lang="ts">
import { downloadFile } from '@oit/utils'
import querySchema from './schema/query.json'

const columns = [
  { prop: 'driverNo', label: '司机ID（T3）' },
  { prop: 'driverName', label: '司机名称' },
  { prop: 'licensePlateNumber', label: '车牌号' },
  { prop: 'contactNumber', label: '联系电话' },
  { prop: 'leaseTerm', label: '期数' },
  { prop: 'vehicleType', label: '车型' },
  { prop: 'pickUpDate', label: '提车日期' },
  { prop: 'driverNatureName', label: '司机性质' },
  { prop: 'driverAttribute', label: '司机属性' },
  { prop: 'witnessSituationName', label: '人证情况' },
]

const queryData = ref()

async function downloadExport() {
  const { data } = await axios.post(
    '/statement/rentOutStatistics/exportRentOutStatisticsList',
    queryData.value,
    { responseType: 'blob' },
  )
  downloadFile(data, '司机招募.xls')
}
</script>

<template>
  <div class="h-full p-3">
    <UseQuery
      v-slot="attrs"
      :columns="columns"
      :columns-config="{}"
      :schema="querySchema"
      url="/statement/driverRecruitmentFee/getDriverRecruitmentFeeList"
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
        </QueryToolbar>
        <QueryTable />
        <QueryPagination />
      </QueryProvide>
    </UseQuery>
  </div>
</template>
