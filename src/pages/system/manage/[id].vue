<script setup lang="ts">
import { FormProvider } from '@formily/vue'
import schema from './schema/editPageForm.json'
import type { UploadUserFile } from 'element-plus'
import type { AsyncDataSourceService } from '@/reactions'
import { handleSubmitFailed, transformUploadData } from '@/utils/actions'

const route = useRoute()
const router = useRouter()

const { t } = useI18n()

const isNew = !!route.query.deptId

const form = createForm({
  validateFirst: true,
})

const getData = async () => {
  if (!isNew) {
    const { data } = await axios.post('/system/user/getUserById', {
      userId: route.params.id,
    })

    if (data.headPortrait) {
      data.headPortrait = [{
        name: 'avatar',
        url: data.headPortrait || '',
        status: 'success',
      }] as UploadUserFile[]
    }

    form.setInitialValues({
      ...data,
    })
  }
}
getData()

const getTreeOrgList: AsyncDataSourceService = async () => {
  const { data } = await axios.post('/system/org/getTreeOrgList', {
    pageSize: 1000,
    pageNum: 1,
  })
  return data.result.map((e: { orgName: string; orgId: number }) => ({
    label: e.orgName,
    value: e.orgId,
  }))
}

async function submit(form: any) {
  const params = {
    ...form,
    headPortrait: transformUploadData(form.headPortrait)?.[0].url,
  }

  if (isNew)
    params.deptId = route.query.deptId
  await axios.post(
    isNew
      ? '/system/user/addUserInfo'
      : '/system/user/updateUserById',
    params,
  )
  ElMessage.success(t('save.success'))
  router.push('/system/manage')
}
</script>

<template>
  <FormProvider :form="form">
    <div class="flex flex-col h-full">
      <PageHeader :title="isNew ? '新增用户' : '编辑用户'" />
      <div class="w-1/2 mt-4">
        <FormLayout class="h-full w-full" label-col="2" u-px-2 wrapper-col="14">
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
