<script setup lang="ts">
import { cloneDeep } from 'lodash-es'
import { onFieldValueChange } from '@formily/core'
import Valuation from '../components/Valuation.vue'
import table from './schema/table.json'
import type { Field as FieldType } from '@formily/core'
import Upload from '~/components/FUpload'
import vehicleCondition from '~/pages/process/schema/vehicleCondition.json'
import { useFlowOption } from '@/pages/process/hooks/useFlowOption'

const flowOption = useFlowOption()
const workOrderReview = inject('workOrderReview') as Ref<any>

const form = createForm({
  effects() {
    onFieldValueChange('vehicleInspectionDetailed.liquidatedDamages.actualApplicationTime', (field) => {
      field = field as FieldType
      field.value && calcLiquidatedDamages(field.value)
    })
  },
})

// 隐藏项
form.setFieldState('vehicleInspectionDetailed.*(vehicleViolation,floatingFee,depreciationCharge)', {
  visible: false,
})

watch(workOrderReview, (data) => {
  const initData = cloneDeep({
    ...data?.vehicleInspectionMap,
    // 维修项
    keepInRepair: data?.repairDetailedMap,
    vehicleSupplementary: data?.vehicleSupplementary,
  })
  form.setInitialValues(initData)
  form.readOnly = !!flowOption.isReview
}, { immediate: true })

!flowOption.isReview && calcLiquidatedDamages()
function calcLiquidatedDamages(time?: string) {
  // 计算违约金
  axios.post('/order/leaseOrder/liquidatedDamages', {
    time,
    workCode: flowOption.workCode,
  }).then(({ data }) => {
    form.setValuesIn('vehicleInspectionDetailed.liquidatedDamages.subtotal', data.liquidatedDamages)
    !time && form.setValuesIn('vehicleInspectionDetailed.liquidatedDamages.actualApplicationTime', data.terminationDate)
  })
}

async function submit(data: any, agree: 0 | 1) {
  const keepInRepair = !data.keepInRepair?.length
  const info = flowOption

  await flowOption.submit?.(data, {
    approvalStatus: agree,
    // 没有维修项时跳到下一个流程
    nextTaskCode: keepInRepair && info
      ? 'CAR_RETURN_SURE'
      : undefined,
  })
}
</script>

<template>
  <div class="h-full flex flex-col validate-car">
    <FormProvider :form="form">
      <PageHeader :title="`申请退租-${$route.query?.workCode}`">
        <template v-if="!flowOption?.isReview" #extra>
          <ElButton type="danger" @click="flowOption.reject()">
            拒绝
          </ElButton>
          <Submit type="primary" @submit="submit($event, 1)">
            通过
          </Submit>
        </template>
      </PageHeader>

      <ElTabs class="flex-1 rounded-b-lg" type="border-card">
        <ElTabPane label="信息补充">
          <FormLayout class="flex flex-col gap-2 p-2" label-width="6em">
            <div class="flex-1 flex flex-col gap-2">
              <Valuation :effects="!flowOption?.isReview" field-name="vehicleInspectionDetailed" />
              <ElCard>
                <UseSchemaField :schema="table" />
              </ElCard>
            </div>
            <div class="flex-1 flex flex-col gap-2">
              <ElCard header="车辆情况">
                <div class="grid grid-cols-4">
                  <ObjectField name="vehicleSupplementary">
                    <UseSchemaField :schema="vehicleCondition" />
                  </ObjectField>
                </div>
              </ElCard>
              <ElCard header="其他附件">
                <Field
                  :component="[Upload, {
                    multiple: true,
                    format: 'url',
                  }]"
                  name="appendix"
                  title="附件"
                />
              </ElCard>
            </div>
          </FormLayout>
        </ElTabPane>
      </ElTabs>
    </FormProvider>
  </div>
</template>
