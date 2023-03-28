<script setup lang="ts">
import { FormProvider } from '@formily/vue'
import schema from './schema/form.json'
import type { UploadUserFile } from 'element-plus'
import { getCityList, getVehicleBrandSeriesModel, useSelectAsyncDataSource, vehicleServiceList } from '@/reactions'
import { handleSubmitFailed, transformUploadData } from '@/utils/actions'

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

    const info = data?.vehicleDetailed

    // 运输证照片
    if (info?.transporteCard) {
      info.transporteCard.transporteCardImg = [{
        name: 'transporteCardImg',
        url: info.transporteCard.transporteCardImg || '',
        status: 'success',
      }] as UploadUserFile[]
    }

    // 行驶证照片
    if (info?.driveLicense) {
      info.driveLicense.driveLicenceOriginal = [{
        name: 'driveLicenceOriginal',
        url: info.driveLicense.driveLicenceOriginal || '',
        status: 'success',
      }] as UploadUserFile[]

      info.driveLicense.driveLicenceEctype = [{
        name: 'driveLicenceEctype',
        url: info.driveLicense.driveLicenceEctype || '',
        status: 'success',
      }] as UploadUserFile[]
    }

    // 车辆细节图片
    if (info?.imgList) {
      info.imgList.carFrontImg = [{
        name: 'carFrontImg',
        url: info.imgList.carFrontImg || '',
        status: 'success',
      }] as UploadUserFile[]

      info.imgList.carRearImg = [{
        name: 'carRearImg',
        url: info.imgList.carRearImg || '',
        status: 'success',
      }] as UploadUserFile[]

      info.imgList.carLeftImg = [{
        name: 'carLeftImg',
        url: info.imgList.carLeftImg || '',
        status: 'success',
      }] as UploadUserFile[]

      info.imgList.carRightImg = [{
        name: 'carRightImg',
        url: info.imgList.carRightImg || '',
        status: 'success',
      }] as UploadUserFile[]

      info.imgList.carOtherImg = [{
        name: 'carOtherImg',
        url: info.imgList.carOtherImg || '',
        status: 'success',
      }] as UploadUserFile[]
    }

    form.setInitialValues({
      ...data.vehicleDetailed,
    })
  }
}
getDetailInfo()

async function submit(formData: any) {
  await ElMessageBox.confirm('确定要提交吗?', '提示', {
    type: 'warning',
  })
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
        transporteCardNumber: formData.transporteCard.transporteCardNumber,
        certificateHandlingMoney: formData.transporteCard.certificateHandlingMoney,
        cardCommencementDate: formData.transporteCard.cardCommencementDate,
        cardMaturityDate: formData.transporteCard.cardMaturityDate,
        transporteCardImg: getImageUrl(formData.transporteCard.transporteCardImg),
      },
      driveLicense: {
        licensePlateNumber: formData.driveLicense.licensePlateNumber,
        licenseNumber: formData.driveLicense.licenseNumber,
        cardMaturityDate: formData.driveLicense.cardMaturityDate,
        fileNumber: formData.driveLicense.fileNumber,
        owner: formData.driveLicense.owner,
        registrationDate: formData.driveLicense.registrationDate,
        openingDate: formData.driveLicense.openingDate,
        checkValidUntil: formData.driveLicense.checkValidUntil,
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
        <UseSchemaField :schema="schema" :scope="{ useSelectAsyncDataSource, getCityList, vehicleServiceList, getVehicleBrandSeriesModel }" />
      </FormLayout>
      <div class="mt-auto flex justify-center py-2">
        <Submit size="large" @submit="submit" @submit-failed="handleSubmitFailed">
          {{ $t('button.save') }}
        </Submit>
      </div>
    </div>
  </FormProvider>
</template>
