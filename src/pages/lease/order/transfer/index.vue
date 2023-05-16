<script setup lang="ts">
import { FormItem, Input } from '@formily/element-plus'
import { transformResponsePush } from '@/utils/helper'
import Valuation from '@/pages/process/car-rental-return/components/components/Valuation.vue'

const { t } = useI18n()
const route = useRoute()
const router = useRouter()
const form = createForm()
const vehicleId = ref()
const changeInfo = ref()
const orderNo = route.query?.orderNo
const recordsId = route.query?.recordsId
const isNew = !!orderNo

const vehicleItemNow = ref()

if (!isNew) {
  form.readOnly = true
  getinfo()
}

// 隐藏项
form.setFieldState('*.*(trailerFee,liquidatedDamages)', {
  visible: false,
})

// 设置维修项初始值
form.setValuesIn(
  'vehicleInspection.vehicleAccessories',
  [
    '车钥匙',
    '行驶证',
    '运输证',
    '灭火器',
    '脚垫',
    '紧急警示牌',
    '拖车钩',
    '其它',
  ].map(item => ({
    receivable: item,
    missing: false,
    subtotal: 0,
  })),
)

// 获取换车记录详情
async function getinfo() {
  const { data } = await axios.post('/order/leaseOrder/getVehicleChangeInfo', {
    recordsId,
  })
  changeInfo.value = data
  vehicleItemNow.value = changeInfo.value?.currentVehicleInfo
  form.setValues(changeInfo.value)
  // 允许修改
  data.code === 1 && form.setFieldState('*.*(floatingFee,depreciationCharge,vehicleViolation)', {
    readOnly: false,
  })
}

function executeQuery(fn: any, data: any) {
  fn({
    data: {
      pageNum: 1,
      pageSize: 10,
      ...data,
    },
  })
}

const {
  data: vehicleList,
  isLoading: vehicleLoading,
  execute: getVehicleList,
} = useAxios(
  '/vehicle/vehicle/getVehicles',
  { transformResponse: transformResponsePush(data => data.vehicleList) },
  { immediate: false },
)
const vehicleItem = computed(() => vehicleList.value?.find((item: any) => item.vehicleId === vehicleId.value))

async function submit(formData: any) {
  await ElMessageBox.confirm(t('confirm.submit'), t('tip.info'))
  await axios.post('/order/leaseOrder/addVehicleChangeRecords', {
    leaseOrderNo: orderNo,
    currentVehicleId: vehicleId.value,
    ...formData,
  })
  ElMessage.success('提交成功')
  router.back()
}

async function submitEdit(formData: any) {
  await ElMessageBox.confirm(t('confirm.submit'), t('tip.info'))
  await axios.post('/order/leaseOrder/updateVehicleChangeRecords', {
    recordsId,
    vehicleInspection: formData.vehicleInspection,
  })
  ElMessage.success('提交成功')
  router.back()
}
</script>

<template>
  <div class="transfer formily-readonly p-2 flex flex-col gap-2">
    <FormProvider :form="form">
      <PageHeader :title="!isNew ? '换车详情' : '换车申请'">
        <template #extra>
          <Submit v-if="isNew" type="primary" @submit="submit">
            提交
          </Submit>
          <Submit v-if="!isNew && changeInfo?.code === 1" type="primary" @submit="submitEdit">
            提交
          </Submit>
        </template>
      </PageHeader>
      <ElCard v-if="!isNew" header="原车信息">
        <Descriptions
          border
          :data="changeInfo?.originalVehicleInfo"
          default-text="暂无"
          label-width="130px"
          :options="[
            { label: '车牌号', prop: 'licensePlateNumber' },
            { label: '车架号', prop: 'vehicleFrameNumber' },
            { label: '城市', prop: 'city' },
            { label: '品牌车系车型', prop: 'vehicleModel' },
            { label: '车身颜色', prop: 'bodyColor' },
            { label: '行驶里程', prop: 'mileage' },
            { label: '终止时间', prop: 'endTime' },
          ]"
        />
      </ElCard>
      <ElCard :header="!isNew ? '换车信息' : ''">
        <template v-if="isNew" #header>
          <div>
            <span>车牌号：</span>
            <ElSelect
              v-model="vehicleId"
              default-first-option
              filterable
              :loading="vehicleLoading"
              placeholder="请输入内容搜索"
              remote
              :remote-method="(v: any) => v && executeQuery(getVehicleList, { licensePlateNumber: v, vehicleState: 0 })"
              remote-show-suffix
              reserve-keyword
            >
              <ElOption
                v-for="item in vehicleList"
                :key="item.vehicleId"
                :label="`${item.licensePlateNumber}`"
                :value="item.vehicleId"
              />
            </ElSelect>
          </div>
        </template>
        <Descriptions
          border
          :data="!isNew ? vehicleItemNow : vehicleItem"
          default-text="暂无"
          label-width="130px"
          :options="[
            { label: '车牌号', prop: 'licensePlateNumber' },
            { label: '车架号', prop: 'vehicleFrameNumber' },
            { label: '城市', prop: 'city' },
            { label: '品牌车系车型', prop: 'vehicleModel' },
            { label: '车身颜色', prop: 'bodyColor' },
            { label: '行驶里程', prop: 'mileage' },
            { label: '终止时间', prop: 'endTime' },
          ]"
        />
      </ElCard>

      <template v-if="vehicleItem || vehicleItemNow">
        <Valuation effects field-name="vehicleInspection" />

        <ElCard header="换车原因">
          <div>
            <Field
              :component="[Input.TextArea, {
                'show-word-limit': true,
                'maxlength': 50,
              }]"
              :decorator="[FormItem]"
              name="vehicleChangeInstruc"
              required
            />
            <div v-if="route.query.hide" class="flex justify-between items-center">
              <div>
                处理人：{{ changeInfo.createName || '暂无' }}
              </div>
              <div>
                处理时间：{{ changeInfo.createTime }}
              </div>
            </div>
          </div>
        </ElCard>
      </template>
    </FormProvider>
  </div>
</template>

<style lang="scss" scoped>
.transfer :deep(.el-card__body) {
  --el-card-padding: 12px;
}
</style>
