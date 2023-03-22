<script setup lang="ts">
import { Checkbox } from '@formily/element-plus'
import { workOrderSubmitSymbol } from '../../types'
import table from './schema/table.json'
import Upload from '~/components/FUpload'
import { transformUploadData } from '@/utils/actions'

const form = createForm()
const workOrderSubmit = inject(workOrderSubmitSymbol)

function submit(data: any) {
  console.log(data)
  data = {
    ...data,
    vehicleCondition: transformUploadData(data.vehicleCondition).map(item => item.url),
    appendix: transformUploadData(data.appendix).map(item => item.url),
  }
  workOrderSubmit?.(data, {
    approvalStatus: 1,
  })
}
</script>

<template>
  <div class="h-full flex flex-col">
    <FormProvider :form="form">
      <PageHeader title="申请退租">
        <template #extra>
          <ElButton type="danger">
            拒绝
          </ElButton>
          <Submit type="primary" @submit="submit">
            通过
          </Submit>
        </template>
      </PageHeader>

      <ElTabs class="flex-1 rounded-b-lg" type="border-card">
        <ElTabPane label="信息补充">
          <FormLayout class="flex flex-col gap-2 p-2" label-col="2">
            <div class="flex-1 flex flex-col gap-2">
              <ElCard class="whitespace-nowrap">
                <FormLayout>
                  <div
                    v-for="item of [
                      { groupKey: 'vehicleViolation', groupName: '车辆违章' },
                      { groupKey: 'floatingFee', groupName: '上浮费' },
                      { groupKey: 'depreciationCharge', groupName: '折旧费' },
                      { groupKey: 'trailerFee', groupName: '拖车费' },
                    ]"
                    :key="item.groupKey"
                    class="flex"
                  >
                    <div class="mt-1 w-5em">
                      {{ item.groupName }}：
                    </div>
                    <div class="grid grid-cols-4 flex-1 gap-2">
                      <ObjectField :name="item.groupKey">
                        <Field
                          v-for="field of [
                            { name: '应收金额', key: 'receivable', validator: 'number' },
                            { name: '已收金额', key: 'netReceipts', validator: 'number' },
                            { name: '小计', key: 'subtotal' },
                            { name: '备注', key: 'remarks', required: false },
                          ]"
                          :key="field.name"
                          :component="[Input]"
                          :decorator="[FormItem]"
                          :name="field.key"
                          :required="field.required ?? true"
                          :validator="field.validator"
                        >
                          <template #prepend>
                            {{ field.name }}
                          </template>
                        </Field>
                      </ObjectField>
                    </div>
                  </div>
                  <div
                    v-for="item of [
                      { groupKey: 'vehicleAccessories', groupName: '车辆配件' },
                      { groupKey: 'liquidatedDamages', groupName: '违约金' },
                    ]"
                    :key="item.groupKey"
                    class="flex"
                  >
                    <div class="mt-1 w-5em">
                      {{ item.groupName }}：
                    </div>
                    <div class="grid grid-cols-4 flex-1 gap-2">
                      <ObjectField :name="item.groupKey">
                        <Field
                          v-for="field of [
                            { name: '信息', key: 'receivable' },
                            { name: '小计', key: 'subtotal' },
                            { name: '备注', key: 'remarks', required: false },
                          ]"
                          :key="field.name"
                          :component="[Input]"
                          :decorator="[FormItem]"
                          :name="field.key"
                          :required="field.required ?? true"
                        >
                          <template #prepend>
                            {{ field.name }}
                          </template>
                        </Field>
                      </ObjectField>
                    </div>
                  </div>
                  <div
                    class="flex"
                  >
                    <div class="mt-1 w-5em">
                      车辆证件：
                    </div>
                    <div class="grid grid-cols-4 flex-1 gap-2">
                      <ObjectField name="vehicleCertificate">
                        <div class="flex gap-4">
                          <Field
                            v-for="field of [
                              { name: '行驶证', key: 'drivingLicense' },
                              { name: '车钥匙', key: 'carKeys' },
                              { name: '运输证', key: 'transportCertificate' },
                            ]"
                            :key="field.name"
                            :component="[Checkbox, {
                              label: field.name,
                            }]"
                            :decorator="[FormItem]"
                            :name="field.key"
                          />
                        </div>
                        <Field
                          v-for="field of [
                            { name: '小计', key: 'subtotal' },
                            { name: '备注', key: 'remarks', required: false },
                          ]"
                          :key="field.name"
                          :component="[Input]"
                          :decorator="[FormItem]"
                          :name="field.key"
                          :required="field.required ?? true"
                        >
                          <template #prepend>
                            {{ field.name }}
                          </template>
                        </Field>
                      </ObjectField>
                    </div>
                  </div>
                </FormLayout>
              </ElCard>
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
                  }]"
                  :decorator="[FormItem]"
                  name="vehicleCondition"
                  title="车辆信息"
                  :validator="{
                    upload: true,
                  }"
                />
              </ElCard>
              <ElCard header="其他附件">
                <Field
                  :component="[Upload, {
                    multiple: true,
                    accept: 'image/*',
                  }]"
                  :decorator="[FormItem]"
                  name="appendix"
                  title="附件"
                  :validator="{
                    upload: true,
                  }"
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
.el-card :deep(.el-card__body) {
  --el-card-padding: 12px;
}
</style>
