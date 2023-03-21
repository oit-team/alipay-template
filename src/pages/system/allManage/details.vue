<script setup lang="ts">
import { FormProvider } from '@formily/vue'
import { cloneDeep } from 'lodash-es'
import schema from './schema/editPageForm.json'
import { handleSubmitFailed } from '@/utils/actions'

const route = useRoute()
const router = useRouter()

const { t } = useI18n()

const isNew = !route.query.orgName

const form = createForm({
  validateFirst: true,
})

const infoData = ref()
infoData.value = cloneDeep(route.query)

const orgList = ref([])

if (isNew)
  form.setInitialValues({ orgName: '', address: '' })
else
  form.setInitialValues({ ...infoData.value })

async function getTreeOrgList() {
  const res = await axios.post('/system/org/getTreeOrgList', {
    pageSize: 1000,
    pageNum: 1,
  })
  orgList.value = res.data.result
}

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
      <PageHeader :title="isNew ? '新增用户' : '编辑用户'" />
      <div class="w-1/2 mt-4">
        <FormLayout class="h-full w-full" label-col="3" u-px-2 wrapper-col="18">
          <UseSchemaField :schema="schema" :scope="{ getTreeOrgList }" />
        </FormLayout>
        <div class="mt-auto flex justify-center py-2">
          <Submit size="large" @submit="submit" @submit-failed="handleSubmitFailed">
            {{ $t('button.submit') }}
          </Submit>
        </div>
      </div>
    </div>
  </FormProvider>
</template>
