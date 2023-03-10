<script setup lang="ts">
import { FormProvider } from '@formily/vue'
import schema from './schema/form.json'
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
  url: '/driverServer/driver/getDriverMap',
  data: {
    driverId: route.params.id,
  },
})

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

function submitFailed(err: any) {
  ElMessage.error(`还有${err.length}项内容未填写`)
}
</script>

<template>
  <FormProvider :form="form">
    <div class="flex flex-col h-full">
      <PageHeader :title="isNew ? '添加司机' : '编辑司机'" />
      <FormLayout
        u-px-2
        label-col="4"
        wrapper-col="10"
      >
        <UseSchemaField :schema="schema" />
      </FormLayout>
      <div class="mt-auto flex justify-center py-2">
        <Submit size="large" @submit="submit" @submit-failed="submitFailed">
          {{ $t('button.submit') }}
        </Submit>
      </div>
    </div>
  </FormProvider>
</template>
