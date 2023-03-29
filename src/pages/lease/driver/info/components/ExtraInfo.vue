<script setup lang="ts">
import schema from './schema/extra.json'
import { notSavedTips } from '@/utils/actions'

const route = useRoute()
const { t } = useI18n()
const type = ref(1)
const showDrawer = ref(false)

const extraMap = [
  { prop: 't3DriverId', label: '司机id' },
  { prop: 'studyRecord', label: '学历' },
  { prop: 'entryTime', label: '入职日期' },
  { prop: 'isPatrol', label: '是否巡游' },
  { prop: 'driverGrade', label: '司机等级' },
  { prop: 'urgentUserName', label: '紧急联系人姓名' },
  { prop: 'urgentUserPhone', label: '紧急联系人电话' },
  { prop: 'urgentUserAdd', label: '紧急联系人住址' },
  { prop: 'politicalOutlook', label: '政治面貌' },
  { prop: 'bloodGroup', label: '血型' },
  { prop: 'operator', label: '所属运营商' },
  { prop: 'city', label: '所属区域' },
  { prop: 'serviceType', label: '服务类型' },
  { prop: 'driverSalaryType', label: '司机工资类别' },
  { prop: 'soleDuty', label: '是否专职' },
  { prop: 'maritalStatus', label: '婚姻状态' },
  { prop: 'householdRegistraHierarchy', label: '户口等级机关' },
  { prop: 'vaccination', label: '疫苗接种情况' },
]

const form = createForm({
  validateFirst: true,
})

const { data: typeList } = useAxios('/driverServer/replenish/getReplenishTypeList', {
  method: 'POST',
  data: {
    driverId: route.params.id,
  },
})

const { data: desc, execute, isLoading } = useAxios('/driverServer/replenish/getDriverReplenish', {
  method: 'POST',
}, { immediate: false })
const hasData = computed(() => !!desc.value)

watch(type, reload)

function reload() {
  execute({
    data: {
      driverId: route.params.id,
      replenishType: type.value,
    },
  })
}

function openDrawer() {
  showDrawer.value = true
  if (hasData.value) {
    form.reset()
    form.setInitialValues(desc.value)
  }
}

async function submit(form: any) {
  await axios.post(
    hasData.value
      ? '/driverServer/replenish/updateDriverReplenish'
      : '/driverServer/replenish/addDriverReplenish',
    {
      ...form,
      driverId: route.params.id,
      replenishType: type.value,
    },
  )
  showDrawer.value = false
  ElMessage.success(t('save.success'))
  reload()
}
</script>

<template>
  <div class="p-2" v-bind="$attrs">
    <div class="flex">
      <ElSelect v-model="type" placeholder="选择补充类型" size="large">
        <ElOption
          v-for="item in typeList?.resultList"
          :key="item.replenishTypeValue"
          :label="item.replenishTypeName"
          :value="item.replenishTypeValue"
        />
      </ElSelect>
      <ElButton
        v-if="type"
        class="ml-auto"
        :loading="isLoading"
        size="large"
        type="primary"
        @click="openDrawer()"
      >
        {{ hasData ? t('button.edit') : t('button.new') }}
      </ElButton>
    </div>
    <Descriptions
      v-if="hasData"
      border
      class="mt-2"
      :data="desc"
      default-text="无"
      :options="extraMap"
    />
    <ElEmpty v-else />
  </div>

  <ElDrawer v-model="showDrawer" :before-close="(done) => notSavedTips(form.modified, done)" title="补充信息">
    <ElScrollbar>
      <FormProvider :form="form">
        <FormLayout class="px-4 pb-4 flex flex-col" label-col="6">
          <UseSchemaField :schema="schema" />
          <Submit @submit="submit">
            {{ t('button.save') }}
          </Submit>
        </FormLayout>
      </FormProvider>
    </ElScrollbar>
  </ElDrawer>
</template>
