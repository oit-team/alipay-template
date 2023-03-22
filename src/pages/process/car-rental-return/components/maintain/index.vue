<script setup lang="ts">
import table from './schema/table.json'
import { handleSubmitFailed } from '@/utils/actions'
import Upload from '@/components/FUpload'

const route = useRoute()
const form = createForm()

const { data } = useAxios('/order/leaseOrder/getRepairOrderInfo', {
  data: {
    workCode: route.query.workCode,
  },
})
</script>

<template>
  <div class="h-full flex flex-col">
    <FormProvider :form="form">
      <Form class="h-full" preview-text-placeholder="暂无">
        <PageHeader title="申请退租">
          <template #extra>
            <ElButton type="danger">
              拒绝
            </ElButton>
            <Submit type="primary" @submit-failed="handleSubmitFailed">
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
                      title="车辆信息"
                    />
                  </ElCard>
                  <ElCard header="其他附件">
                    <Field
                      :component="[Upload, {
                        multiple: true,
                      }]"
                      :decorator="[FormItem]"
                      name="appendix"
                      title="附件"
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
