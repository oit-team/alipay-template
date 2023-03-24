<script setup lang="ts">
import { pick } from 'lodash-es'
import { workOrderSubmitSymbol } from '../../types'
import table from './schema/table.json'
import Upload from '@/components/FUpload'
import { transformToUploadFiles, transformUploadData } from '@/utils/actions'

const { t } = useI18n()
const router = useRouter()
const route = useRoute()
const form = createForm()
const workOrderSubmit = inject(workOrderSubmitSymbol)

const { data } = useAxios('/order/leaseOrder/getRepairOrderInfo', {
  data: {
    workCode: route.query.workCode,
  },
})

watch(data, (data) => {
  form.setInitialValues({
    ...data,
    vehicleCondition: transformToUploadFiles(data.vehicleCondition),
    appendix: transformToUploadFiles(data.appendix),
  })
})

async function submit(data: any, agree: 0 | 1) {
  await workOrderSubmit?.({
    ...pick(data, [
      'repairItem',
      'repairOrderId',
      'repairOrderStatue',
      'repairOrderNumber',
    ]),
    vehicleCondition: transformUploadData(data.vehicleCondition, 'url'),
    appendix: transformUploadData(data.appendix, 'url'),
  }, {
    approvalStatus: agree,
  })

  ElMessage.success(t('submit.success'))
  router.back()
}

async function reject() {
  const { value } = await ElMessageBox.prompt('填写拒绝原因', '提示')

  await workOrderSubmit?.({
    remark: value,
  }, {
    approvalStatus: 0,
  })

  ElMessage.success(t('submit.success'))
  router.back()
}
</script>

<template>
  <div class="h-full flex flex-col">
    <FormProvider :form="form">
      <Form class="h-full" preview-text-placeholder="暂无">
        <PageHeader title="申请退租">
          <template #extra>
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
                      }]"
                      :decorator="[FormItem]"
                      name="vehicleCondition"
                    />
                  </ElCard>
                  <ElCard header="其他附件">
                    <Field
                      :component="[Upload, {
                        multiple: true,
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
