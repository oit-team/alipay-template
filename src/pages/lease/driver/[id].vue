<script setup lang="ts">
import { FormProvider } from '@formily/vue'
import schema from './schema/form.json'
import type { UploadUserFile } from 'element-plus'
import { handleSubmitFailed, transformUploadData } from '@/utils/actions'
import { getCityList, getUserKeyWord } from '@/reactions'

const route = useRoute()
const router = useRouter()
const { t } = useI18n()
const isNew = route.params.id === 'new'

const form = createForm({
  validateFirst: true,
})

// 临时删除JSON
// "driverOperate": {
//               "title": "所属运营商",
//               "x-decorator": "FormItem",
//               "x-component": "Input",
//               "x-index": 4,
//               "name": "driverOperate"
//             },
// "driverFleet": {
//               "type": "string",
//               "title": "所属车队",
//               "x-decorator": "FormItem",
//               "x-component": "Input",
//               "x-index": 6,
//               "name": "driverFleet"
//             },

const getData = async () => {
  const { data } = await axios.post('/driverServer/driver/getDriverMap', {
    driverId: isNew ? null : route.params.id,
  })

  if (data.driverIdentity?.identityImg) {
    data.driverIdentity.identityImg = [{
      name: 'details',
      url: data.driverIdentity?.identityImg[0] || '',
      status: 'success',
    }] as UploadUserFile[]
  }
  if (data.driverIdentity?.identityReverse) {
    data.driverIdentity.identityReverse = [{
      name: 'details',
      url: data.driverIdentity?.identityReverse[0] || '',
      status: 'success',
    }] as UploadUserFile[]
  }
  if (data.driverIdentity?.identityStraight) {
    data.driverIdentity.identityStraight = [{
      name: 'details',
      url: data.driverIdentity?.identityStraight[0] || '',
      status: 'success',
    }] as UploadUserFile[]
  }
  if (data.driveLicense?.driveLicenseAssistant) {
    data.driveLicense.driveLicenseAssistant = [{
      name: 'details',
      url: data.driveLicense?.driveLicenseAssistant[0] || '',
      status: 'success',
    }] as UploadUserFile[]
  }
  if (data.driveLicense?.driveLicenseHost) {
    data.driveLicense.driveLicenseHost = [{
      name: 'details',
      url: data.driveLicense?.driveLicenseHost[0] || '',
      status: 'success',
    }] as UploadUserFile[]
  }
  if (data.driverQualifica?.certificateImg) {
    data.driverQualifica.certificateImg = [{
      name: 'details',
      url: data.driverQualifica?.certificateImg[0] || '',
      status: 'success',
    }] as UploadUserFile[]
  }

  form.setInitialValues(data)
}
!isNew && getData()

async function submit(form: any) {
  if (form.driverIdentity.identityImg)
    form.driverIdentity.identityImg = transformUploadData(form.driverIdentity.identityImg)?.[0].url
  if (form.driverIdentity.identityReverse)
    form.driverIdentity.identityReverse = transformUploadData(form.driverIdentity.identityReverse)?.[0].url
  if (form.driverIdentity.identityStraight)
    form.driverIdentity.identityStraight = transformUploadData(form.driverIdentity.identityStraight)?.[0].url

  if (form.driveLicense.driveLicenseAssistant)
    form.driveLicense.driveLicenseAssistant = transformUploadData(form.driveLicense.driveLicenseAssistant)?.[0].url
  if (form.driveLicense.driveLicenseHost)
    form.driveLicense.driveLicenseHost = transformUploadData(form.driveLicense.driveLicenseHost)?.[0].url

  if (form.driverQualifica.certificateImg)
    form.driverQualifica.certificateImg = transformUploadData(form.driverQualifica.certificateImg)?.[0].url

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
        <UseSchemaField :schema="schema" :scope="{ getCityList, getUserKeyWord }" />
      </FormLayout>
      <div class="mt-auto flex justify-center py-2">
        <Submit size="large" @submit="submit" @submit-failed="handleSubmitFailed">
          {{ $t('button.submit') }}
        </Submit>
      </div>
    </div>
  </FormProvider>
</template>
