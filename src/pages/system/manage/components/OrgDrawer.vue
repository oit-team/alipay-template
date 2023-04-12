<script setup lang="ts">
import { FormButtonGroup, Reset } from '@formily/element-plus'
import deptFormSchema from '../schema/drawerDeptForm.json'
import orgFormSchema from '../schema/drawerOrgForm.json'
import { OrganizationType } from '../enum'
import { getCityList } from '@/reactions'

const emit = defineEmits(['done'])

const { t } = useI18n()

const orgForm = createForm()
const orgDrawer = ref(false)
const isNew = ref(false)
const params = ref()
const schema = computed(() => {
  if (isNew.value) {
    if (params.value?.type === OrganizationType.Company)
      return deptFormSchema
    if (params.value?.type === OrganizationType.HeadOffice)
      return orgFormSchema
  }
  else {
    if (params.value?.type === OrganizationType.Department)
      return deptFormSchema
    if (params.value?.type === OrganizationType.Company || params.value?.type === OrganizationType.HeadOffice)
      return orgFormSchema
  }
})
const title = computed(() => {
  const pre = isNew.value ? '新增' : '编辑'
  if (isNew.value) {
    if (params.value?.type === OrganizationType.Company)
      return `${pre}部门`
    if (params.value?.type === OrganizationType.HeadOffice)
      return `${pre}公司`
  }
  else {
    if (params.value?.type === OrganizationType.Department)
      return `${pre}部门`
    if (params.value?.type === OrganizationType.Company || params.value?.type === OrganizationType.HeadOffice)
      return `${pre}公司`
  }
})
watch(schema, () => {
  orgForm.clearFormGraph()
})
async function submit(data: any) {
  if (isNew.value) {
    switch (params.value?.type) {
      case OrganizationType.Company:
        await axios.post('/system/dept/addDeptInfo', {
          orgId: params.value.id,
          ...data,
        })
        break
      case OrganizationType.HeadOffice:
        await axios.post('/system/org/addOrgInfo', {
          path: '0,1',
          parentId: params.value.id,
          ...data,
        })
        break
    }
  }
  else {
    switch (params.value?.type) {
      case OrganizationType.Department:
        await axios.post('/system/dept/updateDeptInfo', {
          ...data,
        })
        break
      case OrganizationType.Company:
      case OrganizationType.HeadOffice:
        await axios.post('/system/org/updateOrgById', {
          ...data,
        })
        break
    }
  }

  ElMessage.success(t('save.success'))
  close()
  emit('done')
}

function open(data?: any, isNewMode = false) {
  params.value = data
  isNew.value = isNewMode
  orgForm.setValues({}, 'overwrite')
  if (!isNewMode && data) {
    switch (data.type) {
      // 公司初始值
      case OrganizationType.HeadOffice:
      case OrganizationType.Company:
        orgForm.setValues({
          orgId: data.id,
          orgName: data.label,
          orgCode: data.data.orgCode,
          city: data.data.city,
          address: data.data.address,
        })
        break
      // 部门初始值
      case OrganizationType.Department:
        orgForm.setValues({
          deptId: data.id,
          deptName: data.label,
          describe: data.data.describe,
        })
        break
    }
  }
  orgDrawer.value = true
}

function close() {
  orgDrawer.value = false
}

defineExpose({
  open,
  close,
})
</script>

<template>
  <ElDrawer v-model="orgDrawer" direction="rtl" :title="title">
    <FormProvider :form="orgForm">
      <FormLayout
        class="px-6"
        label-width="6em"
      >
        <UseSchemaField v-if="schema" :schema="schema" :scope="{ getCityList }" />
        <FormButtonGroup align-form-item>
          <Submit @submit="submit">
            保存
          </Submit>
          <Reset>重置</Reset>
        </FormButtonGroup>
      </FormLayout>
    </FormProvider>
  </ElDrawer>
</template>
