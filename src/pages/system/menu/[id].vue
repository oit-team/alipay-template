<script setup lang="ts">
import { FormProvider } from '@formily/vue'
import schema from './schema/editPageForm.json'
import { handleSubmitFailed, initForm } from '@/utils/actions'
import { useUserStore } from '@/store/user'

const route = useRoute()
const router = useRouter()
const { t } = useI18n()
const isNew = route.params.id === 'new'

const form = createForm({
  validateFirst: true,
})

onMounted(() => {
  if (!isNew)
    form.query('pId').map()[0].disabled = true
})
if (!isNew) {
  initForm({
    form,
    url: '/system/menu/getAllMenuById',
    data: {
      menuId: route.params.id,
    },
    transform: data => data.resultList,
  })
}

async function getData() {
  const { data } = await axios.post('/system/menu/getAllMenuById', {
    menuId: route.params.id,
  })
  const info = data.resultList
  // const list = info.path.split(',')
  // info.pId = list[list.length - 1]
  info.pId = info.path

  if (info.pId === '0')
    info.pId = undefined

  form.setInitialValues(info)
}
!isNew && getData()

async function getMenu() {
  const { data } = await axios.post('/system/menu/getAllMenuLists', {
    pageNum: 1,
    pageSize: 999,
  })
  return data.resultList.map((e: { menuName: string; menuId: number; path: string }) => ({
    label: e.menuName,
    value: `${e.path},${e.menuId}`,
  }),
  )
}

async function submit(form: any) {
  const { profile } = useUserStore()
  if (!form.pId && isNew)
    form.pId = '0'
  await axios.post(
    isNew
      ? '/system/menu/insertMenu'
      : '/system/menu/updateMenuById',
    {
      ...form,
      userId: profile?.userId,
    },
  )
  ElMessage.success(t('save.success'))
  router.push('/system/menu')
}
</script>

<template>
  <FormProvider :form="form">
    <div class="flex flex-col h-full">
      <PageHeader :title="isNew ? '添加菜单' : '编辑菜单'" />
      <FormLayout
        class="mt-4"
        label-col="2"
        u-px-2
        wrapper-col="10"
      >
        <UseSchemaField :schema="schema" :scope="{ getMenu }" />
      </FormLayout>
      <div class="mt-auto flex justify-center py-2">
        <Submit size="large" @submit="submit" @submit-failed="handleSubmitFailed">
          {{ $t('button.submit') }}
        </Submit>
      </div>
    </div>
  </FormProvider>
</template>
