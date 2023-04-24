<script setup lang="ts">
import DriverInfo from '@/pages/lease/driver/info/[id].vue'
import VehicleInfo from '@/pages/lease/car/info/[id].vue'
import { workOrderInfoSymbol, workOrderSubmitSymbol } from '@/pages/process/types'

const { t } = useI18n()
const router = useRouter()
const workOrderSubmit = inject(workOrderSubmitSymbol)
const workOrderInfo = inject(workOrderInfoSymbol)
const isReview = computed(() => workOrderInfo?.value?.isReview)

async function submit() {
  await workOrderSubmit?.({}, {
    approvalStatus: 1,
  })

  ElMessage.success(t('submit.success'))
  router.back()
}
</script>

<template>
  <div class="h-full flex flex-col">
    <PageHeader :title="`申请租车-${$route.query?.workCode}`">
      <template v-if="!isReview" #extra>
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
