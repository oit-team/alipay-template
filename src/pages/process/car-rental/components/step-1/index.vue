<script setup lang="ts">
import type { UploadUserFile } from 'element-plus'
import { workOrderApplySymbol, workOrderInfoSymbol } from '@/pages/process/types'
import { transformResponsePush } from '@/utils/helper'
import DriverInfo from '@/pages/lease/driver/info/[id].vue'
import VehicleInfo from '@/pages/lease/car/info/[id].vue'
import Upload from '@/components/Upload'
import { transformUploadData } from '@/utils/actions'

const { t } = useI18n()
const router = useRouter()
const workOrderInfo = inject(workOrderInfoSymbol)
const workOrderApply = inject(workOrderApplySymbol)
const workOrderReview = inject('workOrderReview') as Ref<any>
const isReview = computed(() => workOrderInfo?.value?.isReview)

const state = reactive({
  driverId: workOrderInfo?.value.mainParams?.driverId || '',
  vehicleId: workOrderInfo?.value.mainParams?.vehicleId || '',
  schemeId: workOrderInfo?.value.mainParams?.schemeId || '',
  activityId: workOrderInfo?.value.mainParams?.activityId || '',
})

const schemeTypeId = ref(0)

const isSchemeDisabled = computed(() => !state.vehicleId)
const isActivityDisabled = computed(() => !state.schemeId)

const fileList = ref<UploadUserFile[]>([])

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
  data: driverList,
  isLoading: driverLoading,
  execute: getDriverList,
} = useAxios(
  '/driverServer/driver/getDrivers',
  { transformResponse: transformResponsePush(data => data.resultList) },
  { immediate: false },
)
const driverItem = computed(() => workOrderReview.value.leaseOrderBasic ?? driverList.value?.find((item: any) => item.driverId === state.driverId))

const {
  data: vehicleList,
  isLoading: vehicleLoading,
  execute: getVehicleList,
} = useAxios(
  '/vehicle/vehicle/getVehicles',
  { transformResponse: transformResponsePush(data => data.vehicleList) },
  { immediate: false },
)
const vehicleItem = computed(() => workOrderReview.value.leaseOrderBasic ?? vehicleList.value?.find((item: any) => item.vehicleId === state.vehicleId))

const {
  data: schemeList,
  isLoading: schemeLoading,
  execute: getSchemeList,
} = useAxios(
  '/order/scheme/getSchemeList',
  { transformResponse: transformResponsePush(data => data.schemeList) },
  { immediate: false },
)
const schemeItem = computed(() => workOrderReview.value.leaseOrderBasic ?? schemeList.value?.find((item: any) => item.id === state.schemeId))

const {
  data: activityList,
  isLoading: activityLoading,
  execute: getActivityList,
} = useAxios(
  '/order/activity/getActivityList',
  { transformResponse: transformResponsePush(data => data.resultList) },
  { immediate: false },
)

const {
  data: activityData,
  execute: getActivityMap,
} = useAxios(
  '/order/activity/getActivityMap',
  { transformResponse: transformResponsePush(data => data) },
  { immediate: false },
)

watch(schemeTypeId, () => {
  state.schemeId = ''
  schemeList.value = []
})

// 优惠信息 账单信息
const {
  data: preferentialList,
  execute: getOrderPreferential,
} = useAxios(
  '/order/leaseOrder/getOrderPreferential',
  { transformResponse: transformResponsePush(data => data) },
  { immediate: false },
)
watch(() => state.vehicleId, () => {
  state.schemeId = ''
  preferentialList.value = {}
})

watch(() => state.activityId, () => {
  getActivityMap({
    data: {
      activityId: state.activityId,
    },
  })
  getOrderPreferential({
    data: {
      schemeId: state.schemeId,
      activityId: state.activityId,
    },
  })
})

watch(() => state.schemeId, () => {
  state.activityId = ''
  getOrderPreferential({
    data: {
      schemeId: state.schemeId,
      activityId: state.activityId,
    },
  })
})

// 提交第一步
async function submit() {
  const uploadSuccessful = fileList.value?.every?.(file => file.status === 'success')

  const check = [
    [state.driverId, '请选择司机'],
    [state.vehicleId, '请选择车辆'],
    [state.schemeId, '请选择方案'],
    [uploadSuccessful, '请等待文件上传完成'],
  ]
  const checkResult = check.find(item => !item[0])
  if (checkResult) {
    ElMessage.error(checkResult[1] as string)
    return
  }

  const files = transformUploadData(fileList.value)

  const params = {
    leaseTerm: schemeItem.value.leaseTerm,
    primaryEndTime: preferentialList.value?.preferentialMap.primaryEndTime,
    rent: schemeItem.value.rent,
    preferentialRent: preferentialList.value?.preferentialMap.preferentialRent,
    startTime: preferentialList.value?.preferentialMap.startTime,
    endTime: vehicleItem.value.endTime,
    remarks: preferentialList.value?.preferentialMap.remarks,
    contractName: files?.[0].name,
    contractUrl: files?.[0].url,
    mileage: vehicleItem.value.mileage,
    cashPledge: schemeItem.value.cashPledge,
    vehicleAge: schemeItem.value.vehicleAge || '',
    ...state,
  }

  await workOrderApply?.(params)
  ElMessage.success(t('handle.success'))
  router.push('/lease/driver')
}

workOrderInfo?.value.isReview && init()
function init() {
  getOrderPreferential({
    data: {
      schemeId: state.schemeId,
      activityId: state.activityId,
    },
  })
  getActivityMap({
    data: {
      activityId: state.activityId,
    },
  })
}
</script>

<template>
  <div class="flex flex-col">
    <PageHeader title="申请租车">
      <template v-if="!isReview" #extra>
        <ElButton type="primary" @click="submit">
          提交
        </ElButton>
      </template>
    </PageHeader>

    <ElTabs type="border-card" u-h-full>
      <ElTabPane label="申请">
        <div class="flex flex-col gap-2 p-2">
          <ElCard>
            <template #header>
              <div v-if="isReview">
                司机信息
              </div>
              <div v-else>
                <span>司机：</span>
                <ElSelect
                  v-model="state.driverId"
                  default-first-option
                  filterable
                  :loading="driverLoading"
                  placeholder="请输入手机号搜索"
                  remote
                  :remote-method="(v: any) => v && executeQuery(getDriverList, { driverPhone: v, driverStatue: 0 })"
                  remote-show-suffix
                  reserve-keyword
                >
                  <ElOption
                    v-for="item in driverList"
                    :key="item.driverId"
                    :label="`${item.driverName}`"
                    :value="item.driverId"
                  />
                </ElSelect>
              </div>
            </template>
            <Descriptions
              border
              :data="driverItem"
              default-text="暂无"
              label-width="130px"
              :options="[
                { label: '司机', prop: 'driverName' },
                { label: '手机号', prop: 'driverPhone' },
                { label: '身份证号', prop: 'identityCard' },
                { label: '地址', prop: 'address' },
              ]"
            />
          </ElCard>
          <ElCard>
            <template #header>
              <div v-if="isReview">
                车辆信息
              </div>
              <div v-else>
                <span>车牌号：</span>
                <ElSelect
                  v-model="state.vehicleId"
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
              :data="vehicleItem"
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
          <ElCard>
            <template #header>
              <div v-if="isReview">
                方案信息
              </div>
              <div v-else>
                <span>方案类型：</span>
                <ElRadioGroup v-model="schemeTypeId" u-mr-6>
                  <ElRadio :label="0">
                    自营方案
                  </ElRadio>
                  <ElRadio :label="1">
                    T3方案
                  </ElRadio>
                </ElRadioGroup>
                <span>方案编号/名称：</span>
                <ElSelect
                  v-model="state.schemeId"
                  default-first-option
                  :disabled="isSchemeDisabled"
                  filterable
                  :loading="schemeLoading"
                  placeholder="请输入内容搜索"
                  remote
                  :remote-method="(v: any) => v && executeQuery(getSchemeList, {
                    keyWord: v,
                    caseType: schemeTypeId,
                    caseState: 1,
                    vehicleModelId: vehicleItem.vehicleModelId,
                  })"
                  remote-show-suffix
                  reserve-keyword
                >
                  <ElOption
                    v-for="item in schemeList"
                    :key="item.id"
                    :label="`${item.caseName}/${item.caseCode}`"
                    :value="item.id"
                  />
                </ElSelect>
              </div>
            </template>
            <Descriptions
              border
              :data="schemeItem"
              default-text="暂无"
              label-width="130px"
              :options="[
                { label: '品牌车系车型', prop: 'brandCarModel', span: 2 },
                { label: '租期（月）', prop: 'leaseTerm' },
                { label: '月租（元）', prop: 'rent' },
                { label: '押金（元）', prop: 'cashPledge' },
                { label: '车龄（年）', prop: 'vehicleAge' },
                { label: '里程（km）', prop: 'mileage' },
              ]"
            />
          </ElCard>
          <ElCard>
            <template #header>
              <div v-if="isReview">
                活动信息
              </div>
              <div v-else>
                <span>活动名称：</span>
                <ElSelect
                  v-model="state.activityId"
                  default-first-option
                  :disabled="isActivityDisabled"
                  filterable
                  :loading="activityLoading"
                  placeholder="请输入内容搜索"
                  remote
                  :remote-method="(v: any) => v && executeQuery(getActivityList, {
                    activityName: v,
                    activityStatue: 1,
                    schemeId: state.schemeId,
                  })"
                  remote-show-suffix
                  reserve-keyword
                >
                  <ElOption
                    v-for="item in activityList"
                    :key="item.activityId"
                    :label="`${item.activityName}`"
                    :value="item.activityId"
                  />
                </ElSelect>
              </div>
            </template>
            <Descriptions
              border
              :data="activityData"
              default-text="暂无"
              label-width="130px"
              :options="[
                { label: '活动名称', prop: 'activityName' },
                { label: '开始时间', prop: 'startTime' },
                { label: '结束时间', prop: 'endTime' },
                { label: '活动说明', prop: 'activityDescription', span: 3 },
                { label: '活动奖励', prop: 'reward', span: 3 },
              ]"
            >
              <template #reward>
                <QueryTable
                  border
                  :columns="[
                    { label: '奖励类型', prop: 'rewardMethod' },
                    { label: '数量', prop: 'number' },
                    { label: '兑现方式', prop: 'cashingMethod' },
                  ]"
                  :data="activityData?.activityDetails"
                />
              </template>
            </Descriptions>
          </ElCard>
          <ElCard header="租赁合同">
            <div class="p-2">
              <Upload v-model:file-list="fileList" :limit="1" list-type="text">
                <ElButton type="primary">
                  上传
                </ElButton>
              </Upload>
            </div>
          </ElCard>
          <ElCard header="租赁信息">
            <Descriptions
              v-if="preferentialList?.preferentialMap"
              border
              :data="preferentialList?.preferentialMap"
              default-text="暂无"
              label-width="130px"
              :options="[
                { label: '租期（月）', prop: 'leaseTerm' },
                { label: '原月租（元）', prop: 'rent' },
                { label: '优惠月租（元）', prop: 'preferentialRent' },
                { label: '押金（元）', prop: 'cashPledge' },
                { label: '起租日期', prop: 'startTime' },
                { label: '原终止日期', prop: 'primaryEndTime' },
                { label: '终止日期', prop: 'endTime' },
                { label: '备注', prop: 'activityDescription' },
              ]"
            />
            <ElEmpty v-else />
          </ElCard>
          <ElCard header="账单信息">
            <QueryTable
              :columns="[
                { label: '期数', prop: 'numberOfPeriods' },
                { label: '账期', prop: 'accountingPeriod' },
                { label: '月租', prop: 'rent' },
                { label: '备注', prop: 'remarks' },
              ]"
              :data="preferentialList?.orderBill"
            />
          </ElCard>
        </div>
      </ElTabPane>
      <ElTabPane label="司机信息">
        <DriverInfo :driver-id="state.driverId" inset />
      </ElTabPane>
      <ElTabPane label="车辆信息">
        <VehicleInfo inset :vehicle-id="state.vehicleId" />
      </ElTabPane>
    </ElTabs>
  </div>
</template>
