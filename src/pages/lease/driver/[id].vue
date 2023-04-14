<script setup lang="ts">
import { FormProvider } from '@formily/vue'
import schema from './schema/form.json'
import { handleSubmitFailed } from '@/utils/actions'
import { getCityList } from '@/reactions'

const route = useRoute()
const router = useRouter()
const { t } = useI18n()
const isNew = route.params.id === 'new'

const form = createForm({
  validateFirst: true,
})

const getData = async () => {
  const { data } = await axios.post('/driverServer/driver/getDriverMap', {
    driverId: isNew ? null : route.params.id,
  })

  form.setInitialValues(data)
}
!isNew && getData()

async function submit(form: any) {
  await axios.post(
    isNew
      ? '/driverServer/driver/addDriverInfo'
      : '/driverServer/driver/updateDriverInfo',
    form,
  )
  ElMessage.success(t('save.success'))
  router.push('/lease/driver')
}
</script>

<template>
  <FormProvider :form="form">
    <div class="flex flex-col h-full">
      <PageHeader :title="isNew ? '添加司机' : '编辑司机'" />
      <FormLayout
        label-col="4"
        u-px-2
        wrapper-col="10"
      >
        <UseSchemaField :schema="schema" :scope="{ getCityList }" />
      </FormLayout>
      <div class="mt-auto flex justify-center py-2">
        <Submit size="large" @submit="submit" @submit-failed="handleSubmitFailed">
          {{ $t('button.submit') }}
        </Submit>
      </div>
    </div>
  </FormProvider>
</template>
