<script setup lang="ts">
import { pick } from 'lodash-es'
import { workOrderInfoSymbol, workOrderSubmitSymbol } from '../../../types'
import table from './schema/table.json'
import Upload from '@/components/FUpload'

const { t } = useI18n()
const router = useRouter()
const route = useRoute()
const form = createForm()
const workOrderSubmit = inject(workOrderSubmitSymbol)
const workOrderInfo = inject(workOrderInfoSymbol)
const workOrderReview = inject('workOrderReview') as Ref<any>

const readonly = ref(false)

watch(workOrderReview, () => {
  // review或维修确认时，表单只读
  readonly.value = !!workOrderInfo?.value.isReview || workOrderInfo?.value.taskCode === 'CAR_RETURN_VEHICLE_MAINTENANCE_SURE'
  form.readOnly = readonly.value
}, { immediate: true })

const { data: repairOrderInfo } = useAxios('/order/leaseOrder/getRepairOrderInfo', {
  data: {
    workCode: route.query.workCode,
  },
})

watch(repairOrderInfo, (data) => {
  form.setInitialValues({
    ...pick(data, [
      'repairItem',
      'repairOrderId',
      'repairOrderStatue',
      'repairOrderNumber',
      'vehicleCondition',
      'appendix',
    ]),
  })
})

async function submit(data: any, agree: 0 | 1) {
  await workOrderSubmit?.(data, {
    approvalStatus: agree,
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
  <div class="h-full flex flex-col" :class="{ 'formily-readonly': readonly }">
    <FormProvider :form="form">
      <Form class="h-full" preview-text-placeholder="暂无">
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
        <ElTabs class="h-full rounded-b-lg" type="border-card">
          <ElTabPane label="维修补充">
            <FormLayout label-col="3">
              <div class="grid grid-cols-1 p-2 gap-2">
                <ElCard>
                  <UseSchemaField :schema="table" />
                </ElCard>
                <div class="grid grid-cols-2 gap-2">
                  <ElCard header="车辆情况">
                    <Field
                      :component="[Upload, {
                        multiple: true,
                        accept: 'image/*',
                        format: 'url',
                      }]"
                      :decorator="[FormItem]"
                      name="vehicleCondition"
                    />
                  </ElCard>
                  <ElCard header="其他附件">
                    <Field
                      :component="[Upload, {
                        multiple: true,
                        format: 'url',
                      }]"
                      :decorator="[FormItem]"
                      name="appendix"
                    />
                  </ElCard>
                </div>
              </div>
            </FormLayout>
          </ElTabPane>
        </ElTabs>
      </Form>
    </FormProvider>
  </div>
</template>

<style lang="scss" scoped>
.el-card :deep(.el-card__body) {
  --el-card-padding: 12px;
}
</style>
