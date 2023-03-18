<route lang="yaml">
meta:
  cache: false
</route>

<script setup lang="ts">
import { FormProvider } from '@formily/vue'
import schema from './schema/form.json'
import { initForm } from '@/utils/actions'

const route = useRoute()

const form = createForm({
  validateFirst: true,
})

initForm({
  form,
  url: '/order/activityRules/getActivityRulesMap',
  data: {
    rulesId: route.params.id,
  },
})

async function getUnit() {
  const { data } = await axios.post('/order/activity/getDictitemList', { dictCode: 'RULES_UNIT' })
  return data.body.resultList.map((item: { nameKey: string }) => ({
    label: item.nameKey,
    value: item.nameKey,
  }))
}

async function getMethod() {
  const { data } = await axios.post('/order/activity/getDictitemList', { dictCode: 'CASHING_METHOD' })
  return data.body.resultList.map((item: { nameKey: string }) => ({
    label: item.nameKey,
    value: item.nameKey,
  }))
}
</script>

<template>
  <div class="h-full">
    <FormProvider :form="form">
      <div class="flex flex-col h-full">
        <PageHeader title="规则详情" />
        <FormLayout class="h-full w-full" label-col="4" u-px-2 wrapper-col="10">
          <UseSchemaField :schema="schema" :scope="{ getUnit, getMethod }" />
        </FormLayout>
      </div>
    </FormProvider>
  </div>
</template>
