<script setup lang="ts">
import { FormProvider } from '@formily/vue'
import schema from './schema/form.json'
import { handleSubmitFailed, initForm } from '@/utils/actions'

const route = useRoute()
const router = useRouter()
const isNew = route.params.id === 'new'

const form = createForm({
  validateFirst: true,
})

!isNew && initForm({
  form,
  url: '/vehicle/vehicle/getVehicleDetailed',
  data: {
    vehicleId: route.params.id,
  },
  transform: data => data.vehicleDetailed,
})

async function submit(form: any) {
  await axios.post(
    isNew
      ? '/vehicle/vehicle/addVehicle'
      : '/vehicle/vehicle/updateVehicle',
    {
      ...form,
      vehicleId: isNew ? undefined : route.params.id,
    },
  )
  ElMessage.success('保存成功')
  router.push('/lease/car')
}
</script>

<template>
  <FormProvider :form="form">
    <div class="flex flex-col h-full">
      <PageHeader :title="isNew ? '添加车辆' : '编辑车辆'" />
      <FormLayout
        label-col="4"
        u-px-2
        wrapper-col="10"
      >
        <UseSchemaField :schema="schema" />
      </FormLayout>
      <div class="mt-auto flex justify-center py-2">
        <Submit size="large" @submit="submit" @submit-failed="handleSubmitFailed">
          保存
        </Submit>
      </div>
    </div>
  </FormProvider>
</template>
