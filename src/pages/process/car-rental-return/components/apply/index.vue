<script setup lang="ts">
import { pick } from 'lodash-es'
import { workOrderApplySymbol, workOrderInfoSymbol } from '../../../types'
import schema from './schema/form.json'
import { transformResponsePush } from '@/utils/helper'
import DriverInfo from '@/pages/lease/driver/info/[id].vue'
import VehicleInfo from '@/pages/lease/car/info/[id].vue'

const { t } = useI18n()
const router = useRouter()
const vehicleId = ref()

const workOrderApply = inject(workOrderApplySymbol)
const workOrderInfo = inject(workOrderInfoSymbol)
const workOrderReview = inject('workOrderReview') as Ref<any>

const {
  data: vehicleList,
  isLoading: vehicleLoading,
  execute: getVehicleList,
} = useAxios(
  '/order/returnVehicleOrder/getVehicleMap',
  { transformResponse: transformResponsePush(data => data.resultList) },
  { immediate: false },
)

const vehicleInfo = computed(() => vehicleList.value?.find((item: any) => item.vehicleId === vehicleId.value))
const driverId = computed(() => vehicleInfo.value?.driverId)

const form = createForm()

watch(workOrderReview, (data) => {
  const initData = data?.returnVehicleOrderMap
  vehicleId.value = initData?.vehicleId
  vehicleList.value = data?.resultList
  form.setInitialValues({
    ...initData,
  })
  form.readOnly = !!workOrderInfo?.value.isReview
}, { immediate: true })

watch(vehicleInfo, async (data) => {
  form.setFieldState('returnTheCarTime', {
    validator: [
      { required: true },
      (value) => {
        return new Date(vehicleInfo.value.startTime) > new Date(value)
          ? '退车时间不能小于租车时间'
          : true
      },
    ],
  })
})

async function submit(data: any) {
  if (!vehicleInfo.value)
    return ElMessage.error('请选择车辆')

  await ElMessageBox.confirm(t('confirm.submit'), t('tip.info'), {
    type: 'info',
  })

  await workOrderApply?.({
    ...data,
    ...pick(vehicleInfo.value, ['vehicleId', 'driverId', 'leaseOrderNo']),
  })

  ElMessage.success(t('submit.success'))
  router.back()
}
</script>

<template>
  <div
    class="flex flex-col"
  >
    <FormProvider :form="form">
      <PageHeader :title="$route.query?.workCode ? `申请退租-${$route.query?.workCode}` : '申请退租'">
        <template v-if="!workOrderInfo?.isReview" #extra>
          <Submit type="primary" @submit="submit" />
        </template>
      </PageHeader>

      <ElTabs type="border-card" u-h-full>
        <ElTabPane label="申请">
          <div class="flex flex-col gap-2 p-2">
            <ElCard>
              <template #header>
                <div>
                  <span>车牌号：</span>
                  <ElSelect
                    v-model="vehicleId"
                    default-first-option
                    filterable
                    :loading="vehicleLoading"
                    placeholder="请输入内容搜索"
                    :readonly="workOrderInfo?.isReview"
                    remote
                    :remote-method="(v: any) => getVehicleList({ data: { licensePlateNumber: v, pageSize: 10, pageNum: 1 } })"
                    remote-show-suffix
                    reserve-keyword
                  >
                    <ElOption
                      v-for="item in vehicleList"
                      :key="item.vehicleId"
                      :label="item.licensePlateNumber"
                      :value="item.vehicleId"
                    />
                  </ElSelect>
                </div>
              </template>
              <Descriptions
                v-if="vehicleInfo"
                border
                :data="vehicleInfo"
                default-text="暂无"
                label-width="130px"
                :options="[
                  { label: '车架号', prop: 'vehicleFrameNumber' },
                  { label: '司机姓名', prop: 'driverName' },
                  { label: '身份证号', prop: 'identityCard' },
                  { label: '所属运营商', prop: 'driverOperate' },
                  { label: '起租日期', prop: 'startTime' },
                  { label: '到租日期', prop: 'endTime' },
                ]"
              />
            </ElCard>
            <ElCard v-if="vehicleInfo" header="退车信息">
              <div class="pt-4">
                <FormLayout
                  label-col="5"
                >
                  <UseSchemaField :schema="schema" />
                </FormLayout>
              </div>
            </ElCard>
          </div>
        </ElTabPane>
        <ElTabPane label="司机信息">
          <DriverInfo :driver-id="driverId" inset />
        </ElTabPane>
        <ElTabPane label="车辆信息">
          <VehicleInfo :car-number="vehicleInfo?.licensePlateNumber" inset :vehicle-id="vehicleId" />
        </ElTabPane>
      </ElTabs>
    </FormProvider>
  </div>
</template>
