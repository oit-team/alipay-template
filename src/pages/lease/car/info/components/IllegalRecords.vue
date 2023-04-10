<route lang="yaml">
meta:
  cache: true
  </route>

<script setup lang="ts">
import { vehicleParamsSymbol } from '../types'

const columnsConfig = {
  projectName: {
    width: 150,
  },
  companyName: {
    width: 150,
  },
  plateNumber: {
    width: 150,
  },
  violationTime: {
    width: 150,
  },
  codeOfViolation: {
    width: 150,
  },
  violationScore: {
    minWidth: 150,
  },
  forfeit: {
    width: 150,
  },
  illegalBehavior: {
    width: 150,
  },
  violationAddress: {
    width: 150,
  },
  gatherOrgan: {
    width: 150,
  },
  disposeState: {
    width: 150,
  },
  violationRecordNumber: {
    width: 150,
  },
  disposeTime: {
    width: 150,
  },
  queryTime: {
    width: 150,
  },
}

const queryRef = ref()
const vehicleParams = inject(vehicleParamsSymbol)
const vehicleId = vehicleParams?.vehicleId

onMounted(() => {
  queryRef.value?.query()
})
</script>

<template>
  <div class="h-full p-2">
    <UseQuery
      v-slot="attrs"
      :columns-config="columnsConfig"
      columns-key="1681112122659"
      :data="{
        vehicleId,
      }"
      :key-map="{ data: 'resultList', total: 'totalCount' }"
      url="/vehicle/vehicle/getViolationInfo"
    >
      <QueryProvide
        v-bind="attrs"
        ref="queryRef"
        auto-query="active"
      >
        <QueryTable />
        <QueryPagination />
      </QueryProvide>
    </UseQuery>
  </div>
</template>
