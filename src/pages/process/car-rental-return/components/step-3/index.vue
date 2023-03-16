<script setup lang="ts">
import table from './schema/table.json'
import { handleSubmitFailed } from '@/utils/actions'

const form = createForm()
const log = console.log
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
            <Submit type="primary" @submit="log" @submit-failed="handleSubmitFailed">
              通过
            </Submit>
          </template>
        </PageHeader>
        <ElTabs class="h-full rounded-b-lg" type="border-card">
          <ElTabPane label="维修补充">
            <FormLayout feedback-layout="none">
              <div class="grid grid-cols-1 p-2 gap-2">
                <ElCard>
                  <UseSchemaField :schema="table" />
                </ElCard>
                <div class="grid grid-cols-2 gap-2">
                  <ElCard header="车辆情况">
                    <div class="p-2">
                      <Field
                        :component="[Upload]"
                        :decorator="[FormItem]"
                        name="upload"
                        title="车尾部"
                      />
                      <Field
                        :component="[Upload]"
                        :decorator="[FormItem]"
                        name="upload"
                        title="车前脸"
                      />
                    </div>
                  </ElCard>
                  <ElCard header="其他附件">
                    <div class="p-2">
                      <Field
                        :component="[Upload]"
                        :decorator="[FormItem]"
                        name="upload"
                        title="车尾部"
                      />
                    </div>
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
