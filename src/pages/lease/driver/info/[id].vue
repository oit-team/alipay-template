<script setup lang="ts">
import { driverParamsSymbol } from './types'
import BaseInfo from './components/BaseInfo.vue'
import ExtraInfo from './components/ExtraInfo.vue'
import LeaseOrder from './components/LeaseOrder.vue'
import Operating from './components/Operating.vue'
import { useReload } from '@/composables/useReload'

const props = defineProps({
  driverId: [String, Number],
  // 标记为组件模式
  inset: Boolean,
})
const route = useRoute()
const { rendered, reload } = useReload()
const driverId = computed(() => +(props.driverId ?? route.params.id))

watch(driverId, () => {
  reload()
})

provide(driverParamsSymbol, reactive({
  driverId,
}))
</script>

<template>
  <div u-h-full>
    <PageHeader v-if="!inset" title="司机详情" />
    <template v-if="driverId">
      <ElTabs v-if="rendered" type="border-card" u-h-full u-rounded-b-lg>
        <ElTabPane label="基本信息">
          <BaseInfo />
        </ElTabPane>
        <ElTabPane label="运营补充">
          <ExtraInfo />
        </ElTabPane>
        <ElTabPane label="运营流水">
          <Operating />
        </ElTabPane>
        <ElTabPane label="租赁订单">
          <LeaseOrder />
        </ElTabPane>
      </ElTabs>
    </template>
    <template v-else>
      <ElEmpty />
    </template>
  </div>
</template>
