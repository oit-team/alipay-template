<script setup lang="ts">
import { FormProvider } from '@formily/vue'
import schema from './schema/form.json'
import type { UploadUserFile } from 'element-plus'
import type { AsyncDataSourceSelectService } from '@/reactions'
import { getVehicleBrandSeriesModel } from '@/reactions'
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
    const { data } = await axios.post('/order/scheme/getSchemeInfo', {
      caseId: route.params.id,
    })
    const info = data?.resultMap

    // 代扣合同模板
    if (info.agencyDeductionTemplateUrl) {
      info.agencyDeductionTemplateUrl = [{
        name: info.agencyDeductionTempName,
        url: info.agencyDeductionTemplateUrl || '',
        status: 'success',
      }] as UploadUserFile[]
    }

    // 合同模板
    if (info.contractTemplateUrl) {
      info.contractTemplateUrl = [{
        name: info.contractTemplateName,
        url: info.contractTemplateUrl || '',
        status: 'success',
      }] as UploadUserFile[]
    }

    form.setInitialValues({
      ...info,
    })
  }
}
getDetailInfo()

async function submit(formData: any) {
  await ElMessageBox.confirm('确定要提交吗?', '提示', {
    type: 'warning',
  })
  await axios.post(
    isNew
      ? '/order/scheme/addSchemeInfo'
      : '/order/scheme/updateSchemeInfo',
    {
      ...formData,
      caseId: isNew ? undefined : route.params.id,
      // 上传的图片数据
      agencyDeductionTempName: transformUploadData(formData.agencyDeductionTemplateUrl)?.[0].name, // 上传获得的名称
      agencyDeductionTemplateUrl: transformUploadData(formData.agencyDeductionTemplateUrl)?.[0].url,
      contractTemplateName: transformUploadData(formData.contractTemplateUrl)?.[0].name, // 上传获得的名称
      contractTemplateUrl: transformUploadData(formData.contractTemplateUrl)?.[0].url,
    },
  )
  ElMessage.success(t('save.success'))
  router.go(-1)
}

// 租赁城市选择框
const loadData: AsyncDataSourceSelectService = async ({ keyword }) => {
  if (!keyword)
    return []
  const { data } = await axios.post('/order/scheme/getCitiesName', { keyWord: keyword })
  return data.citiesName
}
</script>

<template>
  <FormProvider :form="form">
    <div class="flex flex-col h-full px-4 py-2">
      <PageHeader :title="isNew ? '添加方案' : '编辑方案'" />
      <FormLayout
        label-col="3"
        wrapper-col="10"
      >
        <UseSchemaField :schema="schema" :scope="{ loadData, getVehicleBrandSeriesModel }" />
      </FormLayout>
      <div class="mt-auto flex justify-center py-2">
        <Submit size="large" @submit="submit" @submit-failed="handleSubmitFailed">
          {{ $t('button.save') }}
        </Submit>
      </div>
    </div>
  </FormProvider>
</template>
