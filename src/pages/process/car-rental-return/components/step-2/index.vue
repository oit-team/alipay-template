<script setup lang="ts">
import { Checkbox } from '@formily/element-plus'
import table from './schema/table.json'
import Upload from '~/components/FUpload'

const form = createForm()
const log = console.log
const switchProps = {
  'inline-prompt': true,
  'active-text': '存在',
  'inactive-text': '丢失',
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
          <Submit type="primary" @submit="log">
            通过
          </Submit>
        </template>
      </PageHeader>

      <ElTabs class="flex-1 rounded-b-lg" type="border-card">
        <ElTabPane label="信息补充">
          <FormLayout class="flex gap-2 p-2" label-col="2">
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
                    <div class="mt-1">
                      {{ item.groupName }}：
                    </div>
                    <div class="flex gap-2">
                      <ObjectField :name="item.groupKey">
                        <Field
                          v-for="field of [
                            { name: '应收金额', key: 'receivable' },
                            { name: '已收金额', key: 'netReceipts' },
                            { name: '小计', key: 'subtotal', required: false },
                            { name: '备注', key: 'remarks', required: false },
                          ]"
                          :key="field.name"
                          :component="[Input, {
                            placeholder: field.name,
                          }]"
                          :decorator="[FormItem]"
                          :name="field.key"
                          :required="field.required ?? true"
                        />
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
                    <div class="mt-1">
                      {{ item.groupName }}：
                    </div>
                    <div class="flex gap-2">
                      <ObjectField :name="item.groupKey">
                        <Field
                          v-for="field of [
                            { name: '请输入信息', key: 'receivable' },
                            { name: '小计', key: 'subtotal', required: false },
                            { name: '备注', key: 'remarks', required: false },
                          ]"
                          :key="field.name"
                          :component="[Input, {
                            placeholder: field.name,
                          }]"
                          :decorator="[FormItem]"
                          :name="field.key"
                          :required="field.required ?? true"
                        />
                      </ObjectField>
                    </div>
                  </div>
                  <div
                    class="flex"
                  >
                    <div class="mt-1">
                      车辆证件：
                    </div>
                    <div class="flex gap-2">
                      <ObjectField name="vehicleCertificate">
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
                        <Field
                          v-for="field of [
                            { name: '小计', key: 'subtotal', required: false },
                            { name: '备注', key: 'remarks', required: false },
                          ]"
                          :key="field.name"
                          :component="[Input, {
                            placeholder: field.name,
                          }]"
                          :decorator="[FormItem]"
                          :name="field.key"
                          :required="field.required ?? true"
                        />
                      </ObjectField>
                    </div>
                  </div>
                </FormLayout>
              </ElCard>
              <ElCard>
                <Field
                  :component="[InputNumber, { min: 0 }]"
                  :decorator="[FormItem]"
                  name="key1"
                  title="违约金"
                />
              </ElCard>
              <ElCard>
                <UseSchemaField :schema="table" />
              </ElCard>
            </div>
            <div class="flex-1 flex flex-col gap-2">
              <ElCard header="车辆情况">
                <Field
                  :component="[Upload, {
                    limit: 5,
                  }]"
                  :decorator="[FormItem]"
                  name="upload"
                  title="车辆信息"
                />
              </ElCard>
              <ElCard header="其他附件">
                <Field
                  :component="[Upload]"
                  :decorator="[FormItem]"
                  name="upload"
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
.el-card :deep(.el-card__body) {
  --el-card-padding: 12px;
}
</style>
