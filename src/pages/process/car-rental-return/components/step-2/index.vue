<script setup lang="ts">
import table from './schema/table.json'
import { handleSubmitFailed } from '@/utils/actions'

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
          <Submit type="primary" @submit="log" @submit-failed="(err: any) => handleSubmitFailed(err, { mode: 'single' })">
            通过
          </Submit>
        </template>
      </PageHeader>

      <ElTabs class="flex-1 rounded-b-lg" type="border-card">
        <ElTabPane label="信息补充">
          <div class="flex gap-6">
            <div class="flex-1 flex flex-col gap-2 p-2">
              <ElCard>
                <FormLayout feedback-layout="none" label-col="4">
                  <Field
                    v-for="field of [
                      { label: '车钥匙', key: 'key' },
                      { label: '行驶证', key: 'key' },
                      { label: '运输证', key: 'key' },
                      { label: '灭火器', key: 'key' },
                      { label: '脚垫', key: 'key' },
                      { label: '紧急警示牌', key: 'key' },
                      { label: '拖车钩', key: 'key' },
                    ]"
                    :key="field.label"
                    :component="[Switch, switchProps]"
                    :decorator="[FormItem]"
                    :name="field.label"
                    :title="field.label"
                  />
                </FormLayout>
              </ElCard>
              <ElCard>
                <FormLayout feedback-layout="none" label-col="2">
                  <Field
                    :component="[InputNumber, { min: 0 }]"
                    :decorator="[FormItem]"
                    name="key1"
                    title="违约金"
                  />
                </FormLayout>
              </ElCard>
              <ElCard>
                <UseSchemaField :schema="table" />
              </ElCard>
            </div>
            <div class="flex-1">
              <Field :component="[Upload]" />
            </div>
          </div>
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
