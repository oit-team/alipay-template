<script setup lang="ts">
import { cloneDeep } from 'lodash-es'
import Valuation from '../components/Valuation.vue'
import { flowOptionSymbol } from '@/pages/process/types'

const workOrderReview = inject('workOrderReview') as Ref<any>
const flowOption = inject(flowOptionSymbol)!

const form = createForm()
// 隐藏项
form.setFieldState('vehicleInspectionDetailed.*(trailerFee,liquidatedDamages,vehicleLossAssessment,vehicleCertificate)', {
  hidden: true,
})

watch(workOrderReview, (data) => {
  form.setInitialValues(cloneDeep({
    ...data?.vehicleInspectionMap,
  }))
  form.readOnly = !!flowOption.value.isReview
}, { immediate: true })
</script>

<template>
  <div class="flex flex-col h-full p-2 gap-2">
    <FormProvider :form="form">
      <PageHeader :title="`申请退租-${$route.query?.workCode}`">
        <template v-if="!flowOption.isReview" #extra>
          <ElButton type="danger" @click="flowOption.reject()">
            拒绝
          </ElButton>
          <Submit type="primary" @submit="flowOption.submit($event, 1)">
            通过
          </Submit>
        </template>
      </PageHeader>

      <Valuation effects field-name="vehicleInspectionDetailed" />
    </FormProvider>
  </div>
</template>
