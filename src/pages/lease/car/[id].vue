<script setup lang="ts">
import { FormProvider } from '@formily/vue'
import schema from './schema/form.json'
import { getCityList, getVehicleBrandSeriesModel, useSelectAsyncDataSource } from '@/reactions'
import { handleSubmitFailed } from '@/utils/actions'

const { t } = useI18n()

const route = useRoute()
const router = useRouter()
const isNew = route.params.id === 'new'

const form = createForm({
  validateFirst: true,
})

const getDetailInfo = async () => {
  if (!isNew) {
    const { data } = await axios.post('/vehicle/vehicle/getVehicleDetailed', {
      vehicleId: route.params.id,
    })

    form.setInitialValues({
      ...data.vehicleDetailed,
      vehicleModelId: data?.vehicleDetailed?.vehicleModelId || undefined,
    })
  }
}
!isNew && getDetailInfo()

async function submit(formData: any) {
  await ElMessageBox.confirm('确定要提交吗?', '提示', {
    type: 'warning',
  })

  await axios.post(
    isNew
      ? '/vehicle/vehicle/addVehicle'
      : '/vehicle/vehicle/updateVehicle',
    {
      ...formData,
      vehicleId: isNew ? undefined : route.params.id,
    },
  )
  ElMessage.success(t('save.success'))
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
        <UseSchemaField :schema="schema" :scope="{ useSelectAsyncDataSource, getCityList, getVehicleBrandSeriesModel }" />
      </FormLayout>
      <div class="mt-auto flex justify-center py-2">
        <Submit size="large" @submit="submit" @submit-failed="handleSubmitFailed">
          {{ $t('button.save') }}
        </Submit>
      </div>
    </div>
  </FormProvider>
</template>
