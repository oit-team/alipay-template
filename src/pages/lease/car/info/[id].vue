<script setup lang="ts">
import IllegalRecords from './components/IllegalRecords.vue'
import ExtraInfo from './components/ExtraInfo.vue'
import LeaseOrder from './components/LeaseOrder.vue'
import Statement from './components/Statement.vue'
import BaseInfo from './components/BaseInfo.vue'
import { vehicleParamsSymbol } from './types'
import { useReload } from '@/composables/useReload'

const props = defineProps({
  vehicleId: [String, Number],
  carNumber: [String, Number],
  // 标记为组件模式
  inset: Boolean,
})

const route = useRoute()

const { rendered, reload } = useReload()
const vehicleId = computed(() => +(props.vehicleId ?? route.params.id))
const carNumber = computed(() => props.carNumber ?? route.query.carNumber)

watch([vehicleId, carNumber], () => {
  reload()
})

provide(vehicleParamsSymbol, reactive({
  vehicleId,
  carNumber,
}))
</script>

<template>
  <div u-h-full>
    <PageHeader v-if="!inset" :title="carNumber ? `车辆详情-${carNumber}` : '车辆详情'" />
    <template v-if="vehicleId">
      <ElTabs v-if="rendered" model-value="baseInfo" type="border-card" u-h-full u-rounded-b-lg>
        <ElTabPane label="基本信息" lazy name="baseInfo">
          <BaseInfo />
        </ElTabPane>
        <ElTabPane label="运营补充" lazy name="replenish">
          <ExtraInfo />
        </ElTabPane>
        <ElTabPane label="运营流水" lazy name="statement">
          <Statement />
        </ElTabPane>
        <ElTabPane label="租赁订单" lazy name="order">
          <LeaseOrder />
        </ElTabPane>
        <ElTabPane label="违章记录" lazy name="record">
          <IllegalRecords />
        </ElTabPane>
      </ElTabs>
    </template>
    <template v-else>
      <ElEmpty />
    </template>
  </div>
</template>
