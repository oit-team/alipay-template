<script setup lang="ts">
import { onFormValuesChange } from '@formily/core'
import RatioData from '../components/RatioData.vue'
import querySchema from '../schema/query.json'
import type { DataBoardInfo } from './types'

const { data, execute } = useAxios<DataBoardInfo>('/reportForm/getDataBoardInfo')

const form = createForm({
  effects: () => [
    onFormValuesChange(() => {
      execute({
        data: form.values,
      })
    }),
  ],
})
</script>

<template>
  <div class="p-2 flex flex-col gap-3">
    <ElCard class="query-card p-2">
      <FormProvider :form="form">
        <FormLayout feedback-layout="none">
          <UseSchemaField :schema="querySchema" />
        </FormLayout>
      </FormProvider>
    </ElCard>
    <RatioData :data="data?.bulletinBoard" />
  </div>
</template>

<style lang="scss" scoped>
.query-card:deep() {
  .el-form-item {
    margin-bottom: 0;
  }
}
</style>
