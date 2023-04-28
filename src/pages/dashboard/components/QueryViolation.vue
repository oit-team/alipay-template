<script setup lang="ts">
import { onFormValuesChange } from '@formily/core'
import dayjs from 'dayjs'
import querySchema from './schema/query-violation.json'
import { getCompanyList } from '@/reactions'

const emit = defineEmits<{
  (e: 'query', data: any): void
}>()

const form = createForm({
  effects: () => [
    onFormValuesChange(() => {
      const data = form.values
      emit('query', {
        ...data,
        orgId: data.orgId,
      })
    }),
  ],
})

form.setInitialValues({
  startTime: dayjs().subtract(1, 'month').format('YYYY-MM-DD'),
  endTime: dayjs().format('YYYY-MM-DD'),
})
</script>

<template>
  <ElCard class="query-card p-2">
    <FormProvider :form="form">
      <FormLayout feedback-layout="none">
        <UseSchemaField :schema="querySchema" :scope=" { getCompanyList }" />
      </FormLayout>
    </FormProvider>
  </ElCard>
</template>
