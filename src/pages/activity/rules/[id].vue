<script setup lang="ts">
import { FormProvider } from '@formily/vue'
import schema from './schema/infoForm.json'
import { initForm } from '@/utils/actions'

const route = useRoute()
const router = useRouter()
const { t } = useI18n()
const isNew = route.params.id === 'new'

const form = createForm({
  validateFirst: true,
})

!isNew && initForm({
  form,
  url: '/order/activityRules/getActivityRulesMap',
  data: {
    rulesId: route.params.id,
  },
})

async function submit(form: any) {
  console.log(form)
  await axios.post(
    isNew
      ? '/order/activityRules/addActivityRules'
      : '/order/activityRules/updateActivityRules',
    form,
  )
  ElMessage.success(t('save.success'))
  router.push('/activity/rules')
}

function submitFailed(err: any) {
  console.log(err)
  ElMessage.error(err.message)
  // ElMessage.error(`还有${err.length}项内容未填写`)
}

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
  <FormProvider :form="form">
    <div class="flex flex-col h-full">
      <PageHeader :title="isNew ? '添加规则' : '编辑规则'" />
      <FormLayout label-col="4" u-px-2 wrapper-col="10">
        <UseSchemaField :schema="schema" :scope="{ getUnit, getMethod }" />
      </FormLayout>
      <div class="mt-auto flex justify-center py-2">
        <Submit size="large" @submit="submit" @submit-failed="submitFailed">
          {{ $t('button.submit') }}
        </Submit>
      </div>
    </div>
  </FormProvider>
</template>
