<script setup lang="ts">
import { cloneDeep } from 'lodash-es'
import { workOrderInfoSymbol, workOrderSubmitSymbol } from '../../../types'
import Valuation from '../components/Valuation.vue'
import table from './schema/table.json'
import Upload from '~/components/FUpload'
import vehicleCondition from '~/pages/process/schema/vehicleCondition.json'

const workOrderSubmit = inject(workOrderSubmitSymbol)
const workOrderInfo = inject(workOrderInfoSymbol)
const workOrderReview = inject('workOrderReview') as Ref<any>

const form = createForm()

// 设置维修项初始值
form.setValuesIn(
  'vehicleInspectionDetailed.vehicleAccessories',
  [
    '车钥匙',
    '行驶证',
    '运输证',
    '灭火器',
    '脚垫',
    '紧急警示牌',
    '拖车钩',
    '其它',
  ].map(item => ({
    receivable: item,
    missing: false,
    subtotal: 0,
  })),
)

// 隐藏项
form.setFieldState('vehicleInspectionDetailed.*(vehicleViolation,floatingFee,depreciationCharge)', {
  visible: false,
})

if (!workOrderInfo?.value.isReview) {
  // 计算违约金
  axios.post('/order/leaseOrder/liquidatedDamages', {
    workCode: workOrderInfo?.value.workCode,
  }).then(({ data }) => {
    form.setValuesIn('vehicleInspectionDetailed.liquidatedDamages.subtotal', data.liquidatedDamages)
    form.setValuesIn('vehicleInspectionDetailed.liquidatedDamages.actualApplicationTime', data.terminationDate)
  })
}

watch(workOrderReview, (data) => {
  const initData = cloneDeep({
    ...data?.vehicleInspectionMap,
    // 维修项
    keepInRepair: data?.repairDetailedMap,
    vehicleSupplementary: data?.vehicleSupplementary,
  })
  form.setInitialValues(initData)
  form.readOnly = !!workOrderInfo?.value.isReview
}, { immediate: true })

async function submit(data: any, agree: 0 | 1) {
  const keepInRepair = !data.keepInRepair?.length
  const info = workOrderInfo?.value

  await workOrderSubmit?.(data, {
    approvalStatus: agree,
    // 没有维修项时跳到下一个流程
    nextTaskCode: keepInRepair && info
      ? 'CAR_RETURN_SURE'
      : undefined,
  })
}

async function reject() {
  await workOrderSubmit?.({}, {
    approvalStatus: 0,
  })
}
</script>

<template>
  <div class="h-full flex flex-col validate-car">
    <FormProvider :form="form">
      <PageHeader :title="`申请退租-${$route.query?.workCode}`">
        <template v-if="!workOrderInfo?.isReview" #extra>
          <ElButton type="danger" @click="reject()">
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
              <Valuation :effects="!workOrderInfo?.isReview" field-name="vehicleInspectionDetailed" />
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
