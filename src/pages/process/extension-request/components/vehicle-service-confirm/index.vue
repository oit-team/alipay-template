<script setup lang="ts">
// import DriverInfo from '@/pages/lease/driver/info/[id].vue'
// import VehicleInfo from '@/pages/lease/car/info/[id].vue'
import { flowOptionSymbol } from '@/pages/process/types'

const form = createForm()
const flowOption = inject(flowOptionSymbol)!

const route = useRoute()

const workCode = route.query?.workCode || ''

const { data } = useAxios('/order/leaseOrder/getViolationInfoByOrderNo', {
  method: 'POST',
  data: { workCode },
})
</script>

<template>
  <div class="flex flex-col">
    <FormProvider :form="form">
      <PageHeader :title="$route.query?.workCode ? `延期申请-${$route.query?.workCode}` : '延期申请'">
        <template #extra>
          <ElButton type="danger" @click="flowOption.reject()">
            拒绝
          </ElButton>
          <Submit type="primary" @submit="flowOption.submit($event)">
            通过
          </Submit>
        </template>
      </PageHeader>
      <ElTabs type="border-card" u-h-full>
        <ElTabPane label="违章查验">
          <div class="flex flex-col gap-2 p-2">
            <ElCard>
              <Descriptions
                v-if="data"
                border
                :data="data"
                default-text="暂无"
                label-width="130px"
                :options="[
                  { label: '违章数量', prop: 'violationsNum' },
                  { label: '已处理', prop: 'processed' },
                  { label: '未处理', prop: 'untreated' },
                  { label: '总扣分', prop: 'totalDeductPoints' },
                  { label: '罚款金额总计', prop: 'totalFineAmount' },
                  { label: '已交罚款', prop: 'finePaid' },
                  { label: '未交罚款', prop: 'unpaidFines' },
                ]"
              />
              <div v-else class="min-h-30 flex justify-center items-center">
                暂无数据
              </div>
            </ElCard>
          </div>
        </ElTabPane>
      <!-- <ElTabPane label="司机信息">
        司机信息
        <DriverInfo :driver-id="state.driverId" inset />
      </ElTabPane>
      <ElTabPane label="车辆信息">
        车辆信息
        <VehicleInfo :car-number="vehicleItem?.licensePlateNumber" inset :vehicle-id="state.vehicleId" />
      </ElTabPane> -->
      </ElTabs>
    </FormProvider>
  </div>
</template>
