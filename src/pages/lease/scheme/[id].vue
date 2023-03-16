<script setup lang="ts">
import { FormProvider } from '@formily/vue'
import schema from './schema/form.json'
import type { AsyncDataSourceSelectService } from '@/reactions'
import { handleSubmitFailed, initForm } from '@/utils/actions'

const route = useRoute()
const router = useRouter()
const isNew = route.params.id === 'new'

const form = createForm({
  validateFirst: true,
})

!isNew && initForm({
  form,
  url: '/order/scheme/getSchemeInfo',
  data: {
    caseId: route.params.id,
  },
  transform: data => data.resultMap,
})

async function submit(form: any) {
  await axios.post(
    isNew
      ? '/order/scheme/addSchemeInfo'
      : '/order/scheme/updateSchemeInfo',
    {
      ...form,
      // agencyDeductionTempName: '123', // 上传获得的名称
      // contractTemplateName: '456', // 上传获得的名称
      caseId: isNew ? undefined : route.params.id,
    },
  )
  ElMessage.success('保存成功')
  router.go(-1)
}

// 租赁城市选择框
const loadData: AsyncDataSourceSelectService = async ({ keyword }) => {
  const { data } = await axios.post('/order/scheme/getCitiesName', { keyWord: keyword })
  return data.body.citiesName
}
</script>

<template>
  <FormProvider :form="form">
    <div class="flex flex-col h-full px-4 py-2">
      <PageHeader :title="isNew ? '添加方案' : '编辑方案'" />
      <FormLayout
        label-col="3"
        wrapper-col="10"
      >
        <UseSchemaField :schema="schema" :scope="{ loadData }" />
      </FormLayout>
      <div class="mt-auto flex justify-center py-2">
        <Submit size="large" @submit="submit" @submit-failed="handleSubmitFailed">
          保存
        </Submit>
      </div>
    </div>
  </FormProvider>
</template>
