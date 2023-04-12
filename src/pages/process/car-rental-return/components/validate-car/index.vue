<script setup lang="ts">
import { cloneDeep, set } from 'lodash-es'
import { onFieldReact } from '@formily/core'
import { workOrderInfoSymbol, workOrderSubmitSymbol } from '../../../types'
import Valuation from '../components/Valuation.vue'
import table from './schema/table.json'
import type { Field as FieldType } from '@formily/core'
import Upload from '~/components/FUpload'

const { t } = useI18n()
const router = useRouter()

const workOrderSubmit = inject(workOrderSubmitSymbol)
const workOrderInfo = inject(workOrderInfoSymbol)
const workOrderReview = inject('workOrderReview') as Ref<any>

const form = createForm({
  effects() {
    const calcKey = ['vehicleViolation', 'floatingFee', 'depreciationCharge', 'trailerFee']
    calcKey.forEach((key) => {
      onFieldReact(`*.${key}.subtotal`, (field) => {
        field = field as FieldType
        const result = form.query(`*.${key}.receivable`).value() - form.query(`*.${key}.netReceipts`).value()
        field.value = Math.floor(result * 100) / 100 || 0
      })
    })
  },
})

// 设置维修项初始值
form.setValuesIn(
  'vehicleInspectionDetailed.vehicleAccessories',
  [
    '车钥匙',
    '灭火器',
  ].map(() => ({
    receivable: '',
    missing: false,
    subtotal: 0,
    remark: '',
  })),
)

watch(workOrderReview, (data) => {
  const initData = cloneDeep({
    ...data?.vehicleInspectionMap,
    // 维修项
    keepInRepair: data?.repairDetailedMap,
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
      ? 'CAR_RETURN_FINANCIAL_APPROVALS'
      : undefined,
  })

  ElMessage.success(t('submit.success'))
  router.back()
}

async function reject() {
  await workOrderSubmit?.({}, {
    approvalStatus: 0,
  })

  ElMessage.success(t('submit.success'))
  router.back()
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
          <FormLayout class="flex flex-col gap-2 p-2" label-col="2">
            <div class="flex-1 flex flex-col gap-2">
              <Valuation field-name="vehicleInspectionDetailed" />
              <ElCard>
                <UseSchemaField :schema="table" />
              </ElCard>
            </div>
            <div class="flex-1 flex flex-col gap-2">
              <ElCard header="车辆情况">
                <Field
                  :component="[Upload, {
                    multiple: true,
                    accept: 'image/*',
                    format: 'url',
                  }]"
                  name="vehicleCondition"
                  title="车辆信息"
                />
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

<style lang="scss" scoped>
.validate-car :deep(.el-card__body) {
  --el-card-padding: 12px;
}
</style>
