<script setup lang="ts">
import { FormProvider } from '@formily/vue'
import schema from './schema/form.json'
import type { AsyncDataSourceSelectService } from '@/reactions'
import { getVehicleBrandSeriesModel } from '@/reactions'

const { t } = useI18n()

const route = useRoute()
const router = useRouter()
const isNew = route.params.id === 'new'

const form = createForm()

const dialogFormVisible = ref(false)
// const refuseForm = createForm()
const refuseForm = ref<any>({
  value: '',
})

const getDetailInfo = async () => {
  if (!isNew) {
    const { data } = await axios.post('/order/scheme/getSchemeInfo', {
      caseId: route.params.id,
    })
    form.setInitialValues({
      ...data?.resultMap,
      brandCarModelId: data?.resultMap?.brandCarModelId || undefined,
    })
  }
  else {
    form.setFieldState('activityNameList', {
      visible: false,
    })
  }
}
getDetailInfo()

// 租赁城市选择框
const loadData: AsyncDataSourceSelectService = async ({ keyword }) => {
  const { data } = await axios.post('/order/scheme/getCitiesName', { keyWord: keyword })
  return data.citiesName
}

async function submit(type: any) {
  const msg = type === '3' ? '通过' : '拒绝'

  await ElMessageBox.confirm(`确定${msg}吗?`, '提示', {
    type: 'warning',
  })
  await axios.post('/order/scheme/updateSchemeStatus', {
    caseId: route.params.id,
    caseState: type,
    schemeNotes: refuseForm.value.value,
  })
  ElMessage.success(t('save.success'))
  router.go(-1)
}

function refuse() {
  dialogFormVisible.value = false
  submit('0')
}
</script>

<template>
  <div>
    <FormProvider :form="form">
      <div class="flex flex-col h-full px-4 py-2">
        <PageHeader :title="isNew ? '添加方案' : '编辑方案'" />
        <FormLayout
          label-col="3"
          wrapper-col="10"
        >
          <UseSchemaField :schema="schema" :scope="{ loadData, getVehicleBrandSeriesModel }" />
        </FormLayout>
        <div v-if="route.query.is && route.query.is === '1'" class="mt-auto flex justify-center py-2">
          <div class="w-full flex justify-around">
            <ElButton type="primary" @click="submit('3')">
              通过
            </ElButton>
            <ElButton type="warning" @click="submit('0')">
              拒绝
            </ElButton>
          </div>
        </div>
      </div>
    </FormProvider>

    <ElDialog v-model="dialogFormVisible" title="审核拒绝">
      <ElForm :model="refuseForm">
        <ElFormItem label="拒绝原因">
          <ElInput
            v-model="refuseForm.value"
            autocomplete="off"
            type="textarea"
          />
        </ElFormItem>
      </ElForm>
      <template #footer>
        <div class="w-full flex justify-around">
          <ElButton @click="dialogFormVisible = false">
            取 消
          </ElButton>
          <ElButton type="primary" @click="refuse">
            确 定
          </ElButton>
        </div>
      </template>
    </ElDialog>
  </div>
</template>
