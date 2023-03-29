<script setup lang="ts">
import schema from './schema/extra.json'
import { notSavedTips } from '@/utils/actions'

const route = useRoute()
const { t } = useI18n()
const type = ref()
const showDrawer = ref(false)

const extraMap = [
  // { prop: 'vehicleId', label: '车辆id' },
  // { prop: 'transporteCardNumber', label: '运输证编号' },
  { prop: 'assetCompany', label: '资产公司' },
  // { prop: 'operator', label: '运营商' },
  // { prop: 'vehicleCreditGrantor', label: '车辆授信方' },
  { prop: 'vehicleHolder', label: '车辆持有方' },
  // { prop: 'vehicleSupplier', label: '车辆供应商' },
  { prop: 'supplyMethod', label: '供应方式' },
  { prop: 'engineCode', label: '发动机/电机编号' },
  { prop: 'modelCode', label: '车型代码' },
  { prop: 'vehiclePrice', label: '车辆价格' },
  { prop: 'keyNumber', label: '钥匙号' },
  { prop: 'city', label: '所属城市' },
  { prop: 'warehouse', label: '库房' },
  { prop: 'reservoirArea', label: '库区' },
  { prop: 'purchaseInvoiceNumber', label: '购买发票编号' },
  { prop: 'purchaseInvoiceDate', label: '购买发票日期' },
  { prop: 'certificateNumber', label: '合格证号' },
  { prop: 'warrantyMileage', label: '质保公里数' },
  { prop: 'warrantyExpirationDate', label: '质保到期时间' },
  { prop: 'maintainMileageIntervals', label: '保养公里数间隔' },
  { prop: 'productLine', label: '产品线' },
  { prop: 'vehicleClass', label: '车型等级' },
  { prop: 'setSource', label: '设定来源' },
  { prop: 'operationalTime', label: '投入运营时间' },
  { prop: 'assetType', label: '资产类型' },
  { prop: 'invoiceImgs', label: '发票照片' },
  { prop: 'certificateImgs', label: '合格证照片' },
  // { prop: 'replenishType', label: '补充类型' },
]

const labelWidth = ref('180px')

const form = createForm({
  validateFirst: true,
})

// 查询补充类型信息
const { data: typeList } = useAxios('/driverServer/replenish/getReplenishTypeList', {
  method: 'POST',
  data: {
    vehicleId: route.params.id,
  },
})

watch(typeList, () => {
  // 默认取第一项
  type.value = typeList.value.resultList?.[0]?.replenishTypeValue
})

const { data: desc, execute, isLoading } = useAxios('/vehicle/vehicle/getT3VehicleReplenish', {
  method: 'POST',
}, { immediate: true })
const hasData = computed(() => !!desc.value?.resultList.length)

watch(type, reload)

function reload() {
  execute({
    data: {
      vehicleId: route.params.id,
      replenishType: type.value,
    },
  })
}

function openDrawer() {
  showDrawer.value = true

  if (hasData.value) {
    form.reset()
    // 反显
    const updateInfo = desc.value.resultList[0]
    form.setInitialValues(updateInfo)
  }
}

async function submit(form: any) {
  await ElMessageBox.confirm('确定要提交吗?', '提示', {
    type: 'warning',
  })
  await axios.post(
    hasData.value
      ? '/vehicle/vehicle/updateVehicleReplenish'
      : '/vehicle/vehicle/addVehicleReplenish',
    {
      ...form,
      vehicleId: route.params.id,
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
      :data="desc?.resultList[0]"
      default-text="无"
      :label-width="labelWidth"
      :options="extraMap"
    >
      <template #invoiceImgs="{ value }">
        <ElImage
          v-if="value"
          fit="cover"
          hide-on-click-modal
          :preview-src-list="[value]"
          :src="value"
          style="width: 100px; height: 100px"
        />
        <div v-else>
          无
        </div>
      </template>
      <template #certificateImgs="{ value }">
        <ElImage
          v-if="value"
          fit="cover"
          hide-on-click-modal
          :preview-src-list="[value]"
          :src="value"
          style="width: 100px; height: 100px"
        />
        <div v-else>
          无
        </div>
      </template>
    </Descriptions>
    <ElEmpty v-else />
  </div>

  <ElDrawer v-model="showDrawer" :before-close="(done) => notSavedTips(form.modified, done)" size="65%" title="补充信息">
    <ElScrollbar>
      <FormProvider :form="form">
        <FormLayout class="px-4 pb-4 flex flex-col" label-col="6">
          <UseSchemaField :schema="schema" />
          <Submit class="w-1/6 self-center" @submit="submit">
            {{ t('button.save') }}
          </Submit>
        </FormLayout>
      </FormProvider>
    </ElScrollbar>
  </ElDrawer>
</template>
