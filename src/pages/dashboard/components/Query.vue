<script setup lang="ts">
import { onFormValuesChange } from '@formily/core'
import dayjs from 'dayjs'
import querySchema from './schema/query.json'
import { getCompanyList, getDriverTypeList } from '@/reactions'

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
        driverType: data.driverType,
      })
    }),
  ],
})

form.setInitialValues({
  time: dayjs().format('YYYY-MM-DD'),
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
