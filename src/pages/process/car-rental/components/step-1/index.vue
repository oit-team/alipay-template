<script setup lang="ts">
import { handleSubmitFailed } from '@/utils/actions'
import { transformResponsePush } from '@/utils/helper'

const { t } = useI18n()
const router = useRouter()

const state = reactive({
  driverId: '',
  vehicleId: '',
  schemeId: '',
  activityId: '',
})
const schemeTypeId = ref(0)

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
  '/driverServer/driver/getDriverList',
  { transformResponse: transformResponsePush(data => data.resultList) },
  { immediate: false },
)
const driverItem = computed(() => driverList.value?.find((item: any) => item.driverId === state.driverId))

const {
  data: vehicleList,
  isLoading: vehicleLoading,
  execute: getVehicleList,
} = useAxios(
  '/vehicle/vehicle/getVehicleList',
  { transformResponse: transformResponsePush(data => data.vehicleList) },
  { immediate: false },
)
const vehicleItem = computed(() => vehicleList.value?.find((item: any) => item.vehicleId === state.vehicleId))

const {
  data: schemeList,
  isLoading: schemeLoading,
  execute: getSchemeList,
} = useAxios(
  '/order/scheme/getSchemeList',
  { transformResponse: transformResponsePush(data => data.schemeList) },
  { immediate: false },
)
const schemeItem = computed(() => schemeList.value?.find((item: any) => item.id === state.schemeId))

const {
  data: activityList,
  isLoading: activityLoading,
  execute: getActivityList,
} = useAxios(
  '/order/activity/getActivityList',
  { transformResponse: transformResponsePush(data => data.resultList) },
  { immediate: false },
)
const activityItem = computed(() => activityList.value?.find((item: any) => item.activityId === state.activityId))

const {
  data: activityData,
  execute: getActivityMap,
} = useAxios(
  '/order/activity/getActivityMap',
  { transformResponse: transformResponsePush(data => data.activityDetails) },
  { immediate: false },
)

watch(schemeTypeId, () => {
  state.schemeId = ''
  schemeList.value = []
})
watch(() => state.activityId, () => {
  getActivityMap({
    data: {
      activityId: state.activityId,
    },
  })
})

// 优惠信息 账单信息
const {
  data: preferentialList,
  execute: getOrderPreferential,
} = useAxios(
  '/order/leaseOrder/getOrderPreferential',
  { transformResponse: transformResponsePush(data => data.body) },
  { immediate: false },
)

watch(() => state.schemeId || state.activityId, () => {
  getOrderPreferential({
    data: {
      schemeId: state.schemeId,
      activityId: state.activityId,
    },
  })
})

// 提交第一步
async function submit() {
  const params = {
    leaseTerm: schemeItem.value.leaseTerm,
    primaryEndTime: preferentialList.value?.preferentialMap.primaryEndTime,
    rent: schemeItem.value.rent,
    preferentialRent: preferentialList.value?.preferentialMap.preferentialRent,
    startTime: preferentialList.value?.preferentialMap.startTime,
    endTime: vehicleItem.value.endTime,
    remarks: preferentialList.value?.preferentialMap.remarks,
    contractName: '', // 上传的合同名称地址
    contractUrl: '',
    mileage: vehicleItem.value.mileage,
    cashPledge: schemeItem.value.cashPledge,
    vehicleAge: schemeItem.value.vehicleAge || '',
    ...state,

  }
  await axios.post(
    '/workFlow/workFlow/workOrderApply',
    {
      flowCode: 'CAR_RENTAL',
      params,
    },
  )
  ElMessage.success(t('handle.success'))
  router.push('/lease/driver')
}
</script>

<template>
  <div class="flex flex-col gap-2 p-2">
    <PageHeader title="申请租车">
      <template #extra>
        <ElButton type="primary" @click="submit" @submit-failed="handleSubmitFailed">
          提交
        </ElButton>
      </template>
    </PageHeader>

    <ElCard>
      <template #header>
        <div>
          <span>司机：</span>
          <ElSelect
            v-model="state.driverId"
            default-first-option
            filterable
            :loading="driverLoading"
            placeholder="请输入手机号搜索"
            remote
            :remote-method="(v: any) => v && executeQuery(getDriverList, { driverPhone: v })"
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
        <div>
          <span>车牌号：</span>
          <ElSelect
            v-model="state.vehicleId"
            default-first-option
            filterable
            :loading="vehicleLoading"
            placeholder="请输入内容搜索"
            remote
            :remote-method="(v: any) => v && executeQuery(getVehicleList, { licensePlateNumber: v })"
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
        <div>
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
            filterable
            :loading="schemeLoading"
            placeholder="请输入内容搜索"
            remote
            :remote-method="(v: any) => v && executeQuery(getSchemeList, {
              keyWord: v,
              caseType: schemeTypeId,
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
        column="4"
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
        <div>
          <span>活动名称：</span>
          <ElSelect
            v-model="state.activityId"
            default-first-option
            filterable
            :loading="activityLoading"
            placeholder="请输入内容搜索"
            remote
            :remote-method="(v: any) => v && executeQuery(getActivityList, {
              activityName: v,
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
        :data="activityItem"
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
            :data="activityData"
          />
        </template>
      </Descriptions>
    </ElCard>

    <ElCard header="优惠信息">
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
</template>
