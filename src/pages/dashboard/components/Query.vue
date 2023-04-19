<script setup lang="ts">
import { onFormValuesChange } from '@formily/core'
import querySchema from '../schema/query.json'
import { getCompanyList, getDriverTypeList } from '@/reactions'

const emit = defineEmits<{
  (e: 'query', data: any): void
}>()

const form = createForm({
  effects: () => [
    onFormValuesChange(() => {
      emit('query', form.values)
    }),
  ],
})
</script>

<template>
  <ElCard class="query-card p-2">
    <FormProvider :form="form">
      <FormLayout feedback-layout="none">
        <UseSchemaField :schema="querySchema" :scope=" { getDriverTypeList, getCompanyList }" />
      </FormLayout>
    </FormProvider>
  </ElCard>
</template>
