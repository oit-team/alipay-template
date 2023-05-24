<script setup lang="ts">
import DriverInfo from '@/pages/lease/driver/info/[id].vue'
import VehicleInfo from '@/pages/lease/car/info/[id].vue'
import { workOrderInfoSymbol, workOrderSubmitSymbol } from '@/pages/process/types'
import { useFlowOption } from '@/pages/process/hooks/useFlowOption'

const workOrderSubmit = inject(workOrderSubmitSymbol)
const workOrderInfo = inject(workOrderInfoSymbol)
const flowOption = useFlowOption()

async function submit() {
  await workOrderSubmit?.({}, {
    approvalStatus: 1,
  })
}
</script>

<template>
  <div class="h-full flex flex-col">
    <PageHeader title="申请退租">
      <template v-if="!flowOption?.isReview" #extra>
        <ElButton type="danger" @click="flowOption?.reject()">
          拒绝
        </ElButton>
        <ElButton type="primary" @click="submit">
          提交
        </ElButton>
      </template>
    </PageHeader>

    <ElTabs class="flex-1" type="border-card">
      <ElTabPane label="司机信息">
        <DriverInfo :driver-id="workOrderInfo?.mainParams.driverId" inset />
      </ElTabPane>
      <ElTabPane label="车辆信息">
        <VehicleInfo inset :vehicle-id="workOrderInfo?.mainParams.vehicleId" />
      </ElTabPane>
    </ElTabs>
  </div>
</template>
