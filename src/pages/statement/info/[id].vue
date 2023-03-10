<route lang="yaml">
meta:
  cache: false
</route>

<script setup lang="ts">
import { FormProvider } from '@formily/vue'
import schema from '../schema/form.json'
import { initForm } from '@/utils/actions'

const route = useRoute()

const form = createForm({
  validateFirst: true,
})

initForm({
  form,
  url: '/vehicle/vehicle/getT3OperationalDataMap',
  data: {
    operatorId: route.params.id,
  },
})
</script>

<template>
  <FormProvider :form="form">
    <div class="flex flex-col h-full">
      <PageHeader title="流水详情" />
      <FormLayout u-px-2 label-col="11" wrapper-col="10" class="h-full w-full">
        <UseSchemaField :schema="schema" />
      </FormLayout>
    </div>
  </FormProvider>
</template>
