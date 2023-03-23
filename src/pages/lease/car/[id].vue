<script setup lang="ts">
import { FormProvider } from '@formily/vue'
import schema from './schema/form.json'
import { getCityList, useSelectAsyncDataSource, vehicleServiceList } from '@/reactions'
import { handleSubmitFailed, initForm, transformUploadData } from '@/utils/actions'

const { t } = useI18n()

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

async function submit(formData: any) {
  const getImageUrl = (list: any) => transformUploadData(list)?.[0].url
  await axios.post(
    isNew
      ? '/vehicle/vehicle/addVehicle'
      : '/vehicle/vehicle/updateVehicle',
    {
      ...formData,
      vehicleId: isNew ? undefined : route.params.id,
      imgList: {
        carFrontImg: getImageUrl(formData.imgList.carFrontImg),
        carRearImg: getImageUrl(formData.imgList.carRearImg),
        carLeftImg: getImageUrl(formData.imgList.carLeftImg),
        carRightImg: getImageUrl(formData.imgList.carRightImg),
        carOtherImg: getImageUrl(formData.imgList.carOtherImg),
      },
      transporteCard: {
        transporteCardImg: getImageUrl(formData.transporteCard.transporteCardImg),
      },
      driveLicense: {
        driveLicenceOriginal: getImageUrl(formData.driveLicense.driveLicenceOriginal),
        driveLicenceEctype: getImageUrl(formData.driveLicense.driveLicenceEctype),
      },
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
        <UseSchemaField :schema="schema" :scope="{ useSelectAsyncDataSource, getCityList, vehicleServiceList }" />
      </FormLayout>
      <div class="mt-auto flex justify-center py-2">
        <Submit size="large" @submit="submit" @submit-failed="handleSubmitFailed">
          {{ $t('button.save') }}
        </Submit>
      </div>
    </div>
  </FormProvider>
</template>
