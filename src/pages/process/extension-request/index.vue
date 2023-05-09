<route lang="yaml">
meta:
  title: 延期申请
  flowCode: CAR_EXTENSION
  </route>

<script setup lang="ts">
import Steps from '../components/Steps.vue'
import { useFlowOption } from '../hooks/useFlowOption'
import ExtensionRequest from './components/extension-request/index.vue'
import vehicleServiceConfirm from './components/vehicle-service-confirm/index.vue'

const flowOption = useFlowOption()
const route = useRoute()

const view = computed(() => ({
  CAR_EXTENSION_APPLY: ExtensionRequest,
  CAR_EXTENSION_VEHICLE_SERVICE_SURE: vehicleServiceConfirm,
}[flowOption?.stepCodeActive as string]))

const {
  data: workOrderReviewExtension,
  isLoading: workOrderReviewLoading,
  execute: getExtensionOrderMap,
} = useAxios('/order/extension/getExtension', {
  data: {
    workCode: route.query?.workCode,
  },
}, { immediate: false })

if (flowOption?.workCode)
  getExtensionOrderMap()

provide('workOrderReviewExtension', workOrderReviewExtension)
</script>

<template>
  <div u-flex="~ col" u-h-full>
    <Steps />
    <Component :is="view" v-if="!workOrderReviewLoading" class="flex-1" />
  </div>
</template>
