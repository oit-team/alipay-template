<script setup lang="ts">
import { FormProvider } from '@formily/vue'
import schema from './schema/editPageForm.json'
import { handleSubmitFailed, initForm } from '@/utils/actions'

const route = useRoute()
const router = useRouter()

const { t } = useI18n()

const isNew = route.params.id === 'new'

const form = createForm({
  validateFirst: true,
})

!isNew && initForm({
  form,
  url: '/system/org/getTreeOrgById',
  data: {
    orgId: route.params.id,
  },
})

async function submit(form: any) {
  const params = { ...form }
  if (isNew) {
    params.parentId = 0
    params.path = 0
  }
  await axios.post(
    isNew
      ? '/system/org/addOrgInfo'
      : '/system/org/updateOrgById',

    params,
  )
  ElMessage.success(t('save.success'))
  router.push('/system/area')
}
</script>

<template>
  <FormProvider :form="form">
    <div class="flex flex-col h-full">
      <PageHeader :title="isNew ? '新增区域' : '修改区域'" />
      <FormLayout class="h-full w-full mt-4" label-col="2" u-px-2 wrapper-col="14">
        <UseSchemaField :schema="schema" />
      </FormLayout>
      <div class="mt-auto flex justify-center py-2">
        <Submit size="large" @submit="submit" @submit-failed="handleSubmitFailed">
          {{ $t('button.save') }}
        </Submit>
      </div>
    </div>
  </FormProvider>
</template>

  <style scoped>
  :deep(.el-card__body) {
    --el-card-padding: 12px;
  }
  </style>
